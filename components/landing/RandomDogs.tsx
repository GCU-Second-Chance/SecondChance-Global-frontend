"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useDogBatch } from "@/lib/react-query/hooks";
import type { Dog } from "@/stores/types";
import { buildShareUrl } from "@/lib/utils/share";

function pickPrimaryImage(images: string[]): string | null {
  const cleaned = (Array.isArray(images) ? images : []).filter(
    (s): s is string => typeof s === "string" && s.trim().length > 0
  );
  if (cleaned.length === 0) return null;
  // Prefer last (often higher quality)
  return cleaned[cleaned.length - 1] ?? null;
}

function DogCard({ dog }: { dog: Dog }) {
  const [fallbackSrc, setFallbackSrc] = useState<string | null>(null);
  const primary = useMemo(() => pickPrimaryImage(dog.images), [dog.images]);
  const href = useMemo(() => buildShareUrl(dog, ""), [dog]);

  return (
    <Link href={href} className="group block overflow-hidden rounded-3xl bg-white shadow transition-all hover:shadow-md">
      <div className="relative h-44 w-full bg-gray-100 md:h-56">
        {primary || fallbackSrc ? (
          <Image
            src={fallbackSrc || primary || "/placeholder-dog.jpg"}
            alt={dog.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
            unoptimized
            onError={() => {
              setFallbackSrc("/placeholder-dog.jpg");
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">🐾</div>
        )}
        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 shadow">
          #{dog.id}
        </div>
      </div>
      <div className="p-3 md:p-4">
        <h3 className="truncate text-base font-bold text-gray-900 md:text-lg" title={dog.name}>
          {dog.name}
        </h3>
        <div className="text-xs text-gray-600 md:text-sm">
          {dog.location.city}, {dog.location.country}
        </div>
      </div>
    </Link>
  );
}

export default function RandomDogs() {
  const { data, isLoading, isError, refetch } = useDogBatch({ limit: 30, offset: 0 });
  const dogs = data?.dogs ?? [];

  return (
    <section id="discover" className="bg-white px-4 py-8 md:py-12">
      <div className="container mx-auto max-w-md md:max-w-2xl">
        <motion.div
          className="mb-6 flex items-center justify-between md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-bold text-gray-900 md:text-2xl">Discover Dogs</h2>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 md:text-sm"
          >
            Refresh
          </button>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-44 animate-pulse rounded-2xl bg-gray-200 md:h-56" />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-dashed p-8 text-center text-gray-600">
            Unable to load dogs. Please try again.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {dogs.map((dog) => (
              <DogCard key={`${dog.id}-${dog.location.country}`} dog={dog} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
