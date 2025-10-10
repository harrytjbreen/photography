import { type FC, type SyntheticEvent, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Photo } from "../model/Photo.ts";
import photosApi from "../api/photos.ts";
import collectionApi from "../api/collections.ts";
import type { Collection } from "../model/Collection.ts";
import { getFullPhotoPath } from "../util.ts";

const CollectionDetail: FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [portraitKeys, setPortraitKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!collectionId) return;
    photosApi
      .getPhotosForCollection(collectionId)
      .then(setPhotos)
      .catch((err) => {
        console.error("Failed to load photos for collection", err);
      });

    collectionApi
      .getCollectionById(collectionId)
      .then(setCollection)
      .catch((err) => {
        console.error("Failed to load collection details", err);
      });
  }, [collectionId]);

  const handleImageLoad = (
    key: string,
    e: SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    const img = e.currentTarget;
    if (img.naturalHeight > img.naturalWidth) {
      setPortraitKeys((prev) => new Set(prev).add(key));
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-4 md:px-6 lg:px-8 py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-semibold">{collection?.Name}</h1>
            <Link
              to="/"
              className="text-sky-400 hover:underline inline-flex items-center"
            >
              ← Back to home
            </Link>
          </div>
          <p className="text-neutral-400 mt-2">
            {photos.length ? `${photos.length} photos` : "Loading photos..."}
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 [grid-auto-rows:200px]">
          {photos.map((photo) => {
            // Determine if photo is portrait based on loaded image dimensions
            const isPortrait = portraitKeys.has(photo.S3Key);
            return (
              <figure
                key={photo.S3Key}
                className={`overflow-hidden rounded-md ${isPortrait ? "row-span-2" : ""}`}
              >
                <img
                  src={getFullPhotoPath(photo.S3Key)}
                  alt={photo.FileName}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  loading="lazy"
                  onLoad={(e) => handleImageLoad(photo.S3Key, e)}
                  className="w-full h-full object-cover select-none rounded-md"
                />
              </figure>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default CollectionDetail;
