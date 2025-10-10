import axios from "axios";
import type { Collection } from "../model/Collection.ts";

class Collections {
  async getAllCollections(): Promise<Collection[]> {
    const response = await axios.get("/collections");
    return response.data;
  }

  async getCollectionById(id: string): Promise<Collection> {
    const response = await axios.get(`/collections/${id}`);
    return response.data;
  }
}

export default new Collections();
