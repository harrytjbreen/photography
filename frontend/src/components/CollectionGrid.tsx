import { type FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CollectionItem from "./CollectionItem";
import type { Collection } from "../model/Collection.ts";
import collectionsApi from "../api/collections.ts";
import { getFullPhotoPath } from "../util.ts";

const CollectionGrid: FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    collectionsApi
      .getAllCollections()
      .then(setCollections)
      .catch((err) => {
        console.error("Failed to load collections", err);
      });
  }, []);

  if (!collections.length) return;

  return (
    <section className="px-4 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {collections.map((item) => (
            <Link
              key={item.CollectionId}
              to={`/collections/${item.CollectionId}`}
              className="group w-full overflow-hidden rounded-lg bg-neutral-900 block focus:outline-none focus:ring-2 focus:ring-sky-400"
              aria-label={`Open collection ${item.Name}`}
            >
              <CollectionItem
                src={getFullPhotoPath(item.PreviewImageS3Key)}
                caption={item.Name}
                alt={`Placeholder ${item.Name}`}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionGrid;
