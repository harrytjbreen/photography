import collectionsService from "../service/collections";
import {jsonResponse} from "../../index";

export const getAllCollections = async () => {
    const collections = await collectionsService.getAllCollections();
    return jsonResponse(collections, 200);
}