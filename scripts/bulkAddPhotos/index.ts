import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { readdirSync, readFileSync } from "fs";
import path from "path";
import { nanoid } from "nanoid";

const REGION = process.env.AWS_REGION || "eu-west-1";
const BUCKET = process.env.PHOTOS_BUCKET || "photos-frontend-123456789012";
const TABLE = process.env.PHOTOS_TABLE || "photos-app";

// Assume you pass a rollId when running: `ts-node bulkAddPhotos.ts ./photos roll123`
const [,, photosDir, rollId] = process.argv;
if (!photosDir || !rollId) {
    console.error("Usage: ts-node bulkAddPhotos.ts <photosDir> <rollId>");
    process.exit(1);
}

const s3 = new S3Client({ region: REGION });
const ddb = new DynamoDBClient({ region: REGION });

async function uploadPhoto(filePath: string, rollId: string) {
    const fileBuffer = readFileSync(filePath);
    const fileName = path.basename(filePath);
    const photoId = nanoid();

    // 1. Upload to S3
    const s3Key = `rolls/${rollId}/${photoId}-${fileName}`;
    await s3.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: s3Key,
        Body: fileBuffer,
        ContentType: "image/jpeg" // could detect dynamically
    }));

    console.log(`Uploaded ${fileName} → s3://${BUCKET}/${s3Key}`);

    // 2. Write record to DynamoDB
    await ddb.send(new PutItemCommand({
        TableName: TABLE,
        Item: {
            PK: { S: `ROLL#${rollId}` },
            SK: { S: `PHOTO#${photoId}` },
            EntityType: { S: "Photo" },
            FileName: { S: fileName },
            S3Key: { S: s3Key },
            UploadedAt: { S: new Date().toISOString() }
        }
    }));

    console.log(`Saved metadata for ${fileName} in DynamoDB`);
}

async function main() {
    const files = readdirSync(photosDir)
        .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
        .map(f => path.join(photosDir, f));

    for (const file of files) {
        await uploadPhoto(file, rollId);
    }

    console.log(`✅ Uploaded ${files.length} photos for roll ${rollId}`);
}

main().catch(err => {
    console.error("Error uploading photos:", err);
    process.exit(1);
});