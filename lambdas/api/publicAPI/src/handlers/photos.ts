import {LambdaEvent} from "../../index";

export const getAllPhotosByCollectionId = async (event: LambdaEvent) => {
    console.log(event.pathParams);
}


