/**
 * Dog Matching Page (Step 2)
 * Carousel view with batched dog loading
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useChallengeStore } from "@/stores";
import DogCarousel from "@/components/challenge/DogCarousel";
import { useDogBatch } from "@/lib/react-query/hooks";
import type { Dog } from "@/stores/types";
import { logDogMatched } from "@/lib/analytics";
import { AlertTriangle } from "lucide-react";

const BATCH_SIZE = 30;

function shuffleDogs(dogs: Dog[]): Dog[] {
  const copy = [...dogs];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = temp;
  }
  return copy;
}

export default function MatchDogPage() {
  const router = useRouter();
  const { selectedFrame, matchDog, goToStep, nextStep } = useChallengeStore();

  const [batchOffset, setBatchOffset] = useState(0);
  const [seed, setSeed] = useState(() => `${Date.now()}`);
  const [orderedDogs, setOrderedDogs] = useState<Dog[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const { data, isLoading, isFetching, isError } = useDogBatch({
    limit: BATCH_SIZE,
    offset: batchOffset,
    seed,
  });

  // Redirect if no frame selected
  useEffect(() => {
    if (!selectedFrame) {
      router.push("/challenge/select-frame");
    }
  }, [selectedFrame, router]);

  // Update local dog order whenever a new batch arrives
  useEffect(() => {
    if (data?.dogs?.length) {
      const shuffled = shuffleDogs(data.dogs);
      setOrderedDogs(shuffled);
      setActiveIndex(shuffled.length > 2 ? 1 : 0);
    }
  }, [data]);

  const currentDog = orderedDogs[activeIndex] ?? null;
  const viewedInBatch = Math.min(activeIndex + 1, orderedDogs.length);
  const displayedCount = batchOffset + viewedInBatch;

  const isInitialLoading = isLoading && orderedDogs.length === 0;
  const isProcessingSelection = isFetching && orderedDogs.length > 0;

  const handleNext = () => {
    if (orderedDogs.length === 0 || isProcessingSelection) {
      return;
    }

    if (activeIndex < orderedDogs.length - 1) {
      setActiveIndex((index) => index + 1);
      return;
    }

    if (data?.meta?.hasMore) {
      setOrderedDogs([]);
      setActiveIndex(0);
      setBatchOffset((offset) => offset + BATCH_SIZE);
      return;
    }

    // No more data; start a fresh randomized cycle
    setOrderedDogs([]);
    setActiveIndex(0);
    setSeed(`${Date.now()}`);
    setBatchOffset(0);
  };

  const handlePrevious = () => {
    if (activeIndex === 0 || orderedDogs.length === 0 || isProcessingSelection) {
      return;
    }
    setActiveIndex((index) => index - 1);
  };

  const handleSelectDog = () => {
    if (!currentDog) return;

    matchDog(currentDog);
    logDogMatched(currentDog.id, currentDog.name, "random");

    goToStep(2);
    nextStep();
    router.push("/challenge/upload-photos");
  };

  const subtitle = useMemo(() => {
    if (isInitialLoading) {
      return "Gathering the sweetest faces for you...";
    }
    if (currentDog) {
      return `Swipe to meet ${currentDog.name} and their friends`;
    }
    return "Unable to load new dogs right now. Please try again.";
  }, [currentDog, isInitialLoading]);

  if (!selectedFrame) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Meet Your Match</h1>
        <p className="text-gray-600">{subtitle}</p>

        <div className="mt-4 inline-flex items-center gap-3 rounded-full bg-[#fff1ec] px-4 py-2 text-sm font-semibold text-[#ff6b5a]">
          <span>{displayedCount}</span>
          <span>dogs discovered</span>
        </div>
      </div>

      {/* Carousel */}
      <div className="mb-10">
        {isInitialLoading ? (
          <CarouselSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">
            <AlertTriangle className="h-10 w-10 text-[#ff6b5a]" />
            <p>We couldn&apos;t fetch new rescue dogs right now.</p>
            <p>Please try again in a moment.</p>
          </div>
        ) : orderedDogs.length > 0 ? (
          <DogCarousel
            dogs={orderedDogs}
            activeIndex={activeIndex}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSelect={handleSelectDog}
            isProcessing={isProcessingSelection}
          />
        ) : (
          <CarouselSkeleton />
        )}
      </div>

      {/* Info Box */}
      <div className="rounded-2xl bg-[#fff9f3] p-6">
        <h3 className="mb-3 text-lg font-semibold text-gray-900">What happens next?</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="text-[#ff6b5a]">•</span>
            <span>Swipe through the rescue spotlight to find the perfect companion.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#ff6b5a]">•</span>
            <span>We&apos;ll help you craft a shareable frame that features them beautifully.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#ff6b5a]">•</span>
            <span>
              Every share increases the chance that {currentDog?.name || "this pup"} finds a loving
              home.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function CarouselSkeleton() {
  return (
    <div className="flex w-full items-center justify-center gap-5 px-4">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`h-[420px] w-[260px] animate-pulse rounded-3xl bg-gray-200 ${
            index === 1 ? "h-[470px] w-[320px]" : ""
          }`}
        />
      ))}
    </div>
  );
}
