import { Collection } from "../model/Collection";
import {
    AttributeValue,
    DynamoDBClient,
    ScanCommand,
    GetItemCommand,
} from "@aws-sdk/client-dynamodb";

class CollectionsService {
    private client = new DynamoDBClient({});

    public getAllCollections = async (): Promise<Collection[] | undefined> => {
        const params = {
            TableName: process.env.PHOTOS_TABLE,
            FilterExpression: "EntityType = :entityType",
            ExpressionAttributeValues: {
                ":entityType": { S: "Collection" },
            },
        };

        const command = new ScanCommand(params);
        const response = await this.client.send(command);

        return response.Items?.map((item) => this.parseCollection(item));
    };

    public getCollectionById = async (
        collectionId: string
    ): Promise<Collection | undefined> => {
        const params = {
            TableName: process.env.PHOTOS_TABLE,
            Key: {
                PK: { S: `COLLECTION#${collectionId}` },
                SK: { S: "COLLECTION" },
            },
        };

        const command = new GetItemCommand(params);
        const response = await this.client.send(command);

        if (!response.Item) return undefined;

        return this.parseCollection(response.Item);
    };

    private parseCollection = (item: Record<string, AttributeValue>): Collection => {
        return {
            Name: item.Name?.S ?? "Unknown",
            CollectionId: item.CollectionId?.S ?? "Unknown",
            CreatedAt: item.CreatedAt?.S ?? "Unknown",
            EntityType: item.EntityType?.S ?? "Unknown",
        };
    };
}

export default new CollectionsService();