import axios from "axios";
import type { Photo } from "../model/Photo.ts";

class Photos {
  async getPhotosForCollection(collection: string): Promise<Photo[]> {
    const response = await axios.get(`/photos/${collection}`);
    return response.data;
  }
}

export default new Photos();
