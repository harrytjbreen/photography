import { type FC } from "react";

export type CollectionItemProps = {
  src: string;
  alt: string;
  caption: string;
};

const CollectionItem: FC<CollectionItemProps> = ({ src, alt, caption }) => {
  return (
    <div className="relative inline-block leading-none">
      <img
        src={src}
        alt={alt}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        className="block w-full h-auto object-cover select-none"
      />
      {caption ? (
        <div className="absolute left-2 bottom-2 max-w-[90%] text-white font-bold bg-black/45 px-2.5 py-1.5 rounded text-sm drop-shadow">
          {caption}
        </div>
      ) : null}
    </div>
  );
};

export default CollectionItem;
