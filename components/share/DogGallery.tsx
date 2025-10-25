"use client";

import React, { memo, useMemo } from "react";
import Image from "next/image";

interface DogGalleryProps {
  images?: string[];
  maxItems?: number;
}

const DogGalleryComponent: React.FC<DogGalleryProps> = ({ images = [], maxItems }) => {
  const list = useMemo(() => {
    if (!images || images.length === 0) return [] as string[];
    // Deduplicate, remove empties
    const clean = images.filter((src): src is string => !!src && typeof src === "string");
    const unique = Array.from(new Set(clean));
    return typeof maxItems === "number" && maxItems > 0 ? unique.slice(0, maxItems) : unique;
  }, [images, maxItems]);

  if (list.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
        No images available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {list.map((src, idx) => (
        <div key={`${src}-${idx}`} className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image src={src} alt={`Dog image ${idx + 1}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
        </div>
      ))}
    </div>
  );
};

const DogGallery = memo(DogGalleryComponent);
DogGallery.displayName = "DogGallery";

export default DogGallery;

