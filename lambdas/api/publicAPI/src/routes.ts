import { getAllCollections } from "./handlers/collections";
import { getAllPhotosByCollectionId } from "./handlers/photos";
import {LambdaEvent} from "../index";

type Handler = (event: LambdaEvent) => Promise<unknown>;

export const routes: Record<string, Record<string, Handler>> = {
    GET: {
        "/collections": getAllCollections,
        "/photos/:id": getAllPhotosByCollectionId,
    },
};