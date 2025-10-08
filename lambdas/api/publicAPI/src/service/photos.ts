import { Photo } from "../model/Photo";
import { DynamoDBClient, QueryCommand, QueryCommandOutput, AttributeValue } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

class PhotosService {
    private client = new DynamoDBClient({});

    public getPhotosByCollectionId = async (collectionId: string): Promise<Photo[]> => {
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

        let allItems: Photo[] = [];
        let lastEvaluatedKey: Record<string, AttributeValue> | undefined = undefined;
        let result: QueryCommandOutput;

        do {
            result = await this.client.send(
                new QueryCommand({
                    ...params,
                    ExclusiveStartKey: lastEvaluatedKey,
                })
            );

            const items =
                result.Items?.map((item) => this.parsePhotoToDTO(item)).filter((p) => p.S3Key) || [];

            allItems = allItems.concat(items);
            lastEvaluatedKey = result.LastEvaluatedKey;
        } while (lastEvaluatedKey);

        return allItems;
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