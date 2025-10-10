import collectionsService from "../service/collections";
import {jsonResponse} from "../../index";

export const getAllCollections = async () => {
    const collections = await collectionsService.getAllCollections();
    return jsonResponse(collections, 200);
}

export const getCollectionById = async (event: any) => {
    if(!event.pathParams || !event.pathParams.id) return jsonResponse({ error: "Collection id is required" }, 400);

    const collection = await collectionsService.getCollectionById(event.pathParams.id);
    return jsonResponse(collection, 200);
}