import { Photo } from "../model/Photo";
import { DynamoDBClient, QueryCommand, AttributeValue } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

class PhotosService {
    private client = new DynamoDBClient({});

    public getPhotosByCollectionName = async (collectionName: string): Promise<Photo[]> => {
        if (!collectionName) throw new Error("Collection name is required");

        const params = {
            TableName: process.env.PHOTOS_TABLE!,
            KeyConditionExpression: "#pk = :pk and begins_with(#sk, :skPrefix)",
            ExpressionAttributeNames: {
                "#pk": "PK",
                "#sk": "SK",
            },
            ExpressionAttributeValues: {
                ":pk": { S: `COLLECTION#${collectionName}` },
                ":skPrefix": { S: "PHOTO#" },
            },
        };

        const result = await this.client.send(new QueryCommand(params));

        return (
            result.Items?.map((item) => {
                const typedItem = this.parsePhoto(item);
                return {
                    FileName: typedItem.FileName,
                    S3Key: typedItem.S3Key,
                    UploadedAt: typedItem.UploadedAt,
                };
            }) ?? []
        );
    };

    public parsePhoto = (item: Record<string, AttributeValue>): Photo => {
        const u = unmarshall(item);
        return {
            FileName: u.fileName ?? "Unknown",
            S3Key: u.s3Key ?? "Unknown",
            UploadedAt: u.createdAt ?? "Unknown",
        };
    };
}

export default new PhotosService();