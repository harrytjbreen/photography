import { getAllCollections } from "./handlers/collections";
import { getAllPhotosByCollectionId } from "./handlers/photos";
import {Handler} from "../index";

export const routes: Record<string, Record<string, Handler>> = {
    GET: {
        "/collections": getAllCollections,
        "/photos/:id": getAllPhotosByCollectionId,
    },
};