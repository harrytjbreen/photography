import {jsonResponse, LambdaEvent} from "../../index";
import photosService from "../service/photos";

export const getAllPhotosByCollectionId = async (event: LambdaEvent) => {
    if(!event.pathParams || !event.pathParams.id) return jsonResponse({ error: "Collection id is required" }, 400);

    const photos = await photosService.getPhotosByCollectionId(event.pathParams.id);
    return jsonResponse(photos, 200);
}
