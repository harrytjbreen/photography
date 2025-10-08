import collectionsService from "../service/collections";
export const getAllCollections = async () => {
    await collectionsService.getAllCollections();
}