"use client";

import { motion, type PanInfo } from "framer-motion";
import Image from "next/image";
import type { Dog } from "@/stores/types";
import { ChevronLeft, ChevronRight, Heart, MapPin } from "lucide-react";

interface DogCarouselProps {
  dogs: Dog[];
  activeIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  onSelect: (dog: Dog) => void;
  isProcessing?: boolean;
}

type CarouselPosition = "previous" | "current" | "next";

const SWIPE_THRESHOLD = 100;

export default function DogCarousel({
  dogs,
  activeIndex,
  onNext,
  onPrevious,
  onSelect,
  isProcessing = false,
}: DogCarouselProps) {
  const currentDog = dogs[activeIndex];
  const previousDog = activeIndex > 0 ? dogs[activeIndex - 1] ?? null : null;
  const nextDog = activeIndex < dogs.length - 1 ? dogs[activeIndex + 1] ?? null : null;

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD && nextDog) {
      onNext();
    } else if (info.offset.x > SWIPE_THRESHOLD && previousDog) {
      onPrevious();
    }
  };

  if (!currentDog) {
    return null;
  }

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="flex w-full items-center justify-center gap-5 px-4"
      >
        <CarouselCard dog={previousDog} position="previous" />
        <CarouselCard
          dog={currentDog}
          position="current"
          onSelect={() => onSelect(currentDog)}
          disableActions={isProcessing}
        />
        <CarouselCard dog={nextDog} position="next" />
      </motion.div>

      <button
        type="button"
        onClick={onPrevious}
        disabled={!previousDog}
        aria-label="View previous dog"
        className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-gray-200 bg-white p-3 text-gray-600 shadow-md transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 md:inline-flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!nextDog}
        aria-label="View next dog"
        className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-gray-200 bg-white p-3 text-gray-600 shadow-md transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 md:inline-flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="mt-6 flex items-center justify-center gap-2">
        {dogs.map((dog, index) => (
          <span
            key={dog.id}
            className={`h-1.5 rounded-full transition-all ${
              index === activeIndex ? "w-8 bg-[#ff6b5a]" : "w-3 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

interface CarouselCardProps {
  dog: Dog | null;
  position: CarouselPosition;
  onSelect?: () => void;
  disableActions?: boolean;
}

function CarouselCard({ dog, position, onSelect, disableActions }: CarouselCardProps) {
  if (!dog) {
    return <div className="hidden h-[420px] w-[260px] flex-shrink-0 lg:block" aria-hidden />;
  }

  const isCurrent = position === "current";

  return (
    <div
      className={`relative flex h-[420px] w-[260px] flex-shrink-0 flex-col overflow-hidden rounded-3xl bg-white shadow-xl transition-all duration-300 ease-out ${
        isCurrent
          ? "z-20 h-[470px] w-[320px] scale-100 opacity-100 blur-0"
          : "pointer-events-none z-10 scale-90 opacity-50 blur-sm"
      }`}
    >
      <div className="relative h-1/2 w-full overflow-hidden bg-gray-100">
        <Image
          src={dog.images[0] || "/placeholder-dog.jpg"}
          alt={dog.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 80vw, 320px"
          priority={isCurrent}
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow">
          #{dog.id.replace("dog_", "")}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 py-5">
        <div className="mb-3">
          <h3 className="text-2xl font-semibold text-gray-900">{dog.name}</h3>
          <p className="text-sm text-gray-600">
            {dog.age} year{dog.age !== 1 ? "s" : ""} • {dog.gender === "male" ? "Male" : "Female"}
          </p>
        </div>

        {dog.breed && (
          <div className="mb-3 flex items-center gap-2 text-sm text-gray-700">
            <Heart className="h-4 w-4 text-[#ff6b5a]" />
            <span>{dog.breed}</span>
          </div>
        )}

        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span>
            {dog.location.city}, {dog.location.country}
          </span>
        </div>

        <div className="mt-auto">
          {isCurrent ? (
            <button
              type="button"
              onClick={onSelect}
              disabled={disableActions}
              className="w-full rounded-2xl bg-[#ff6b5a] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#ff5544] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {disableActions ? "Please wait..." : `Choose ${dog.name}`}
            </button>
          ) : (
            <div className="rounded-2xl bg-gray-100 px-4 py-3 text-center text-xs font-medium text-gray-500">
              Swipe to meet {dog.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
