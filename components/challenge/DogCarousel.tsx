"use client";

import Image from "next/image";
import type { Dog } from "@/stores/types";
import { ChevronLeft, ChevronRight, Heart, MapPin } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import { useEffect, useMemo, useRef, useState } from "react";

import "swiper/css";
import "swiper/css/effect-cards";

interface DogCarouselProps {
  dogs: Dog[];
  activeIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  onSelect: (dog: Dog) => void;
  isProcessing?: boolean;
  disableChoose?: boolean;
}

export default function DogCarousel({
  dogs,
  activeIndex,
  onNext,
  onPrevious,
  onSelect,
  isProcessing = false,
  disableChoose = false,
}: DogCarouselProps) {
  const swiperRef = useRef<any>(null);
  const syncingRef = useRef(false);
  const lastIndexRef = useRef<number>(activeIndex ?? 0);

  // Keep Swiper in sync with parent-provided activeIndex
  useEffect(() => {
    const swiper = swiperRef.current?.swiper;
    if (swiper && typeof activeIndex === "number" && swiper.activeIndex !== activeIndex) {
      // Guard against feedback loop: mark as syncing while we imperatively update Swiper
      syncingRef.current = true;
      swiper.slideTo(activeIndex, 0);
      // Release the lock after Swiper applies the change
      requestAnimationFrame(() => {
        syncingRef.current = false;
        lastIndexRef.current = activeIndex;
      });
    }
  }, [activeIndex]);

  if (!dogs.length) return null;

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <Swiper
        ref={swiperRef}
        effect="cards"
        grabCursor
        modules={[EffectCards]}
        cardsEffect={{ slideShadows: false }}
        onSlideChange={(swiper) => {
          if (syncingRef.current) return;
          const nextIdx = typeof swiper.activeIndex === "number" ? swiper.activeIndex : 0;
          const prevIdx = lastIndexRef.current ?? 0;
          if (nextIdx > prevIdx) onNext();
          else if (nextIdx < prevIdx) onPrevious();
          lastIndexRef.current = nextIdx;
        }}
        initialSlide={activeIndex}
      >
        {dogs.map((dog, index) => (
          <SwiperSlide key={dog.id} style={{ padding: "2em" }}>
            <DogSlide
              dog={dog}
              isCurrent={index === activeIndex}
              onSelect={() => onSelect(dog)}
              disableActions={isProcessing || disableChoose}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        type="button"
        onClick={() => swiperRef.current?.swiper?.slidePrev()}
        disabled={isProcessing}
        aria-label="View previous dog"
        className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-gray-200 bg-white p-3 text-gray-600 shadow-md transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 md:inline-flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => swiperRef.current?.swiper?.slideNext()}
        disabled={isProcessing}
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

function DogSlide({
  dog,
  isCurrent,
  onSelect,
  disableActions,
}: {
  dog: Dog;
  isCurrent: boolean;
  onSelect: () => void;
  disableActions?: boolean;
}) {
  // Prefer the last available image but gracefully fall back to earlier ones if it fails to load
  const candidates = useMemo(() => {
    const imgs = Array.isArray(dog.images) ? dog.images : [];
    const cleaned = imgs.filter((s): s is string => typeof s === "string" && s.trim().length > 0);
    // last-first order (higher index tends to be higher quality)
    return cleaned.reverse();
  }, [dog.images]);

  const [candidateIndex, setCandidateIndex] = useState(0);
  useEffect(() => {
    // reset when dog changes
    setCandidateIndex(0);
  }, [candidates.length, dog.id]);

  const primaryImage = candidates[candidateIndex] || "/placeholder-dog.jpg";
  const ageDisplay =
    typeof dog.age === "number" ? `${dog.age} year${dog.age === 1 ? "" : "s"}` : String(dog.age);
  const genderDisplay =
    dog.gender === "male" ? "Male" : dog.gender === "female" ? "Female" : "Unknown";

  return (
    <div
      className={`relative mx-auto flex h-[470px] w-[320px] max-w-full flex-col overflow-hidden rounded-3xl bg-white shadow-xl transition-all duration-300 ease-out ${
        isCurrent ? "opacity-100" : "opacity-90"
      }`}
    >
      <div className="relative h-1/2 w-full overflow-hidden bg-gray-100">
        <Image
          src={primaryImage}
          alt={dog.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 80vw, 320px"
          priority={isCurrent}
          unoptimized
          onError={() => {
            // Try next candidate if current fails
            setCandidateIndex((i) => (i + 1 < candidates.length ? i + 1 : i));
          }}
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow">
          #{dog.id.replace("dog_", "")}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 py-5">
        <div className="mb-3">
          <h3 className="truncate text-2xl font-semibold text-gray-900" title={dog.name}>
            {dog.name}
          </h3>
          <p className="text-sm text-gray-600">
            {ageDisplay} • {genderDisplay}
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
