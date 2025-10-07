import {
    DynamoDBClient,
    ScanCommand,
    AttributeValue,
} from "@aws-sdk/client-dynamodb";
import {CollectionItem} from "../model/CollectionItem";

const parseCollection = (item: Record<string, AttributeValue>): CollectionItem => {
    return {
        Name: item.Name?.S,
        CreatedAt: item.CreatedAt?.S,
        EntityType: item.EntityType?.S,
    };
};

export const getAllCollections = async (): Promise<
    { Name: string; CreatedAt: string }[]
> => {
    const client = new DynamoDBClient({});
    const params = {
        TableName: process.env.PHOTOS_TABLE,
        FilterExpression: "EntityType = :entityType",
        ExpressionAttributeValues: {
            ":entityType": { S: "Collection" },
        },
    };

    const command = new ScanCommand(params);
    const response = await client.send(command);

    return (
        response.Items?.map((item) => {
            const typedItem = parseCollection(item);
            return {
                Name: typedItem.Name ?? "Unknown",
                CreatedAt: typedItem.CreatedAt ?? "Unknown",
            };
        }) ?? []
    );
};