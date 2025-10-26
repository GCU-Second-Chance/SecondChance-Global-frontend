/**
 * DogCard Component
 * Displays rescue dog information in the matching step
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Dog } from "@/stores/types";
import { Calendar, Heart, MapPin } from "lucide-react";
import { englishAge, englishLocation } from "@/lib/utils/englishize";

interface DogCardProps {
  dog: Dog;
  onSelect?: () => void;
  onReroll?: () => void;
  isLoading?: boolean;
}

export default function DogCard({ dog, onSelect, onReroll, isLoading }: DogCardProps) {
  const ageDisplay = typeof dog.age === "number" ? englishAge(dog.age) : englishAge(String(dog.age ?? ""));
  const genderDisplay =
    dog.gender === "male" ? "Male" : dog.gender === "female" ? "Female" : "Unknown";

  // choose last available image
  const primaryImage = (() => {
    const imgs = Array.isArray(dog.images) ? dog.images : [];
    for (let i = imgs.length - 1; i >= 0; i -= 1) {
      const src = imgs[i];
      if (typeof src === "string" && src.trim().length > 0) return src;
    }
    return "/placeholder-dog.jpg";
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-lg"
    >
      {/* Dog Image */}
      <div className="relative h-80 w-full bg-gray-100">
        <Image
          src={primaryImage}
          alt={dog.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 448px"
          priority
        />
        {/* Overlay Badge */}
        <div className="absolute right-4 top-4 rounded-full bg-[#ff6b5a] px-3 py-1 text-xs font-semibold text-white shadow-md">
          Looking for a home
        </div>
      </div>

      {/* Dog Info */}
      <div className="p-6">
        {/* Name and Age */}
        <div className="mb-4">
          <h2 className="truncate text-2xl font-bold text-gray-900" title={dog.name}>
            {dog.name}
          </h2>
          <p className="text-sm text-gray-600">
            {ageDisplay} • {genderDisplay}
          </p>
        </div>

        {/* Breed */}
        {dog.breed && (
          <div className="mb-4 flex items-center gap-2">
            <Heart className="h-4 w-4 text-[#ff6b5a]" />
            <span className="text-sm text-gray-700">{dog.breed}</span>
          </div>
        )}

        {/* Location */}
        <div className="mb-4 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-700">
            {englishLocation(dog.location.city, dog.location.country, (dog as any).location?.province)}
          </span>
        </div>

        {/* Shelter Info */}
        <div className="mb-6 rounded-lg bg-gray-50 p-4">
          <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Current Shelter</p>
          <p className="mb-1 text-sm font-medium text-gray-900">{dog.shelter.name}</p>
          <p className="text-xs text-gray-600">{dog.shelter.contact}</p>
          {dog.shelter.email && <p className="mt-1 text-xs text-gray-600">{dog.shelter.email}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {onReroll && (
            <button
              onClick={onReroll}
              disabled={isLoading}
              className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "See Another Dog"}
            </button>
          )}
          {onSelect && (
            <button
              onClick={onSelect}
              disabled={isLoading}
              className="flex-1 rounded-lg bg-[#ff6b5a] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#ff5544] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Choose {dog.name}
            </button>
          )}
        </div>

        {/* Added Date */}
        {dog.createdAt && (
          <div className="mt-4 flex items-center justify-center gap-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>Added {new Date(dog.createdAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Loading Skeleton for DogCard
 */
export function DogCardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-lg">
      {/* Image Skeleton */}
      <div className="h-80 w-full animate-pulse bg-gray-200" />

      {/* Content Skeleton */}
      <div className="p-6">
        <div className="mb-4 h-8 w-32 animate-pulse rounded bg-gray-200" />
        <div className="mb-4 h-4 w-24 animate-pulse rounded bg-gray-200" />
        <div className="mb-4 h-4 w-40 animate-pulse rounded bg-gray-200" />
        <div className="mb-4 h-4 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mb-6 h-20 animate-pulse rounded-lg bg-gray-200" />
        <div className="flex gap-3">
          <div className="h-12 flex-1 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-12 flex-1 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
