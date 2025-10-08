import { Photo } from "../model/Photo";
import { DynamoDBClient, QueryCommand, AttributeValue } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

class PhotosService {
    private client = new DynamoDBClient({});

    public getPhotosByCollectionId = async (collectionId: string): Promise<Photo[] | undefined> => {
        if (!collectionId) throw new Error("Collection name is required");

        const params = {
            TableName: process.env.PHOTOS_TABLE!,
            KeyConditionExpression: "#pk = :pk and begins_with(#sk, :skPrefix)",
            ExpressionAttributeNames: {
                "#pk": "PK",
                "#sk": "SK",
            },
            ExpressionAttributeValues: {
                ":pk": { S: `COLLECTION#${collectionId}` },
                ":skPrefix": { S: "PHOTO#" },
            },
        };

        const result = await this.client.send(new QueryCommand(params));

        return (
            result.Items?.map((item) => {
                return this.parsePhotoToDTO(item);
            }).filter((item) => item.S3Key)
        );
    };

    public parsePhotoToDTO = (item: Record<string, AttributeValue>): Photo => {
        const u = unmarshall(item);
        return {
            FileName: u.FileName,
            S3Key: u.S3Key,
            UploadedAt: u.UploadedAt,
        };
    };
}

export default new PhotosService();