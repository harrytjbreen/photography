import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { readdirSync, readFileSync } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const REGION = process.env.AWS_REGION || "eu-west-1";
const BUCKET = process.env.PHOTOS_BUCKET || "photos-storage-688547931126";
const TABLE = process.env.PHOTOS_TABLE || "photos-app";

// Usage: ts-node bulkAddPhotos.ts ./photos <collectionId> --collectionName "My Collection"
const argv = yargs(hideBin(process.argv))
    .option("input", {
        type: "string",
        demandOption: true,
        describe: "Path to the directory containing photos to upload"
    })
    .option("collectionId", {
        type: "string",
        demandOption: true,
        describe: "Slug or machine-friendly identifier of the collection to upload to"
    })
    .option("collectionName", {
        type: "string",
        demandOption: true,
        describe: "Human-readable display name of the collection"
    })
    .parseSync();

const photosDir = argv.input;
const collectionId = argv.collectionId;
const collectionName = argv.collectionName || collectionId;

if (!photosDir || !collectionId) {
    console.error("Usage: ts-node bulkAddPhotos.ts <photosDir> --collectionId <collectionId> [--collectionName <collectionName>]");
    process.exit(1);
}

const s3 = new S3Client({ region: REGION });
const ddb = new DynamoDBClient({ region: REGION });

async function ensureCollectionMetadata(collectionId: string, collectionName: string) {
    const now = new Date().toISOString();
    try {
        await ddb.send(new PutItemCommand({
            TableName: TABLE,
            Item: {
                PK: { S: `COLLECTION#${collectionId}` },
                SK: { S: `COLLECTION#${collectionId}` },
                EntityType: { S: "Collection" },
                CollectionId: { S: collectionId },
                Name: { S: collectionName },
                CreatedAt: { S: now }
            },
            ConditionExpression: "attribute_not_exists(PK)"
        }));
        console.log(`Created collection metadata for "${collectionName}" (slug: "${collectionId}") in DynamoDB`);
    } catch (err: any) {
        if (err.name === "ConditionalCheckFailedException") {
        } else {
            throw err;
        }
    }
}

async function uploadPhoto(filePath: string, collectionId: string) {
    const fileBuffer = readFileSync(filePath);
    const fileName = path.basename(filePath);
    const photoId = uuidv4();

    // Upload to S3
    const s3Key = `collections/${collectionId}/${photoId}-${fileName}`;
    await s3.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: s3Key,
        Body: fileBuffer,
        ContentType: "image/jpeg"
    }));

    console.log(`Uploaded ${fileName} → s3://${BUCKET}/${s3Key}`);

    // Save metadata to DynamoDB
    await ddb.send(new PutItemCommand({
        TableName: TABLE,
        Item: {
            PK: { S: `COLLECTION#${collectionId}` },
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
    await ensureCollectionMetadata(collectionId, collectionName);

    const files = readdirSync(photosDir)
        .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
        .map(f => path.join(photosDir, f));

    for (const file of files) {
        await uploadPhoto(file, collectionId);
    }

    console.log(`Uploaded ${files.length} photos for collection "${collectionName}" (slug: "${collectionId}")`);
}

main().catch(err => {
    console.error("Error uploading photos:", err);
    process.exit(1);
});