/**
 * Dog Matching Page (Step 2)
 * Random dog matching with reroll functionality
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useChallengeStore } from "@/stores";
import DogCard, { DogCardSkeleton } from "@/components/challenge/DogCard";
import { getRandomDog } from "@/data/dogs";
import type { Dog } from "@/stores/types";
import { logDogMatched } from "@/lib/analytics";

export default function MatchDogPage() {
  const router = useRouter();
  const { selectedFrame, matchDog, goToStep, nextStep } = useChallengeStore();
  const [currentDog, setCurrentDog] = useState<Dog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRerolling, setIsRerolling] = useState(false);

  // Redirect if no frame selected
  useEffect(() => {
    if (!selectedFrame) {
      router.push("/challenge/select-frame");
    }
  }, [selectedFrame, router]);

  // Load initial random dog
  useEffect(() => {
    if (selectedFrame) {
      const randomDog = getRandomDog();
      setCurrentDog(randomDog);
      setIsLoading(false);
    }
  }, [selectedFrame]);

  const handleReroll = () => {
    setIsRerolling(true);

    // Simulate API delay
    setTimeout(() => {
      const randomDog = getRandomDog();
      setCurrentDog(randomDog);
      setIsRerolling(false);
    }, 500);
  };

  const handleSelectDog = () => {
    if (!currentDog) return;

    // Update Zustand store
    matchDog(currentDog);

    // Log analytics event
    logDogMatched(currentDog.id, currentDog.name, "random");

    // Move to step 2 and navigate to upload photos
    goToStep(2);
    nextStep(); // This will set step to 3
    router.push("/challenge/upload-photos");
  };

  if (!selectedFrame) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Meet Your Match</h1>
        <p className="text-gray-600">
          This rescue dog is waiting for their second chance. Will you help share their story?
        </p>
      </div>

      {/* Dog Card */}
      <div className="mb-8">
        {isLoading || isRerolling ? (
          <DogCardSkeleton />
        ) : currentDog ? (
          <DogCard
            dog={currentDog}
            onSelect={handleSelectDog}
            onReroll={handleReroll}
            isLoading={isRerolling}
          />
        ) : (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center text-gray-500">
            No dogs available at the moment. Please try again later.
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="rounded-lg bg-[#fff9f3] p-6">
        <h3 className="mb-2 font-semibold text-gray-900">What happens next?</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="text-[#ff6b5a]">•</span>
            <span>You&apos;ll take 3 photos with this dog&apos;s image</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#ff6b5a]">•</span>
            <span>Create a beautiful photo frame to share on social media</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#ff6b5a]">•</span>
            <span>Help {currentDog?.name || "this dog"} find a forever home!</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
