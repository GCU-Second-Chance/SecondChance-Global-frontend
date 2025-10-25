/**
 * Dog Matching Page (Step 2)
 * Swipe through dogs in windows of 10.
 * After 30 viewed (one batch), show Reload to fetch new set.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useChallengeStore } from "@/stores";
import DogCarousel from "@/components/challenge/DogCarousel";
import { useDogBatch } from "@/lib/react-query/hooks";
import type { Dog } from "@/stores/types";
import { logDogMatched } from "@/lib/analytics";
import { AlertTriangle, RefreshCw } from "lucide-react";

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
  const WINDOW_SIZE = 10;
  const [buffer, setBuffer] = useState<Dog[]>([]); // current batch (~30)
  const [windowStart, setWindowStart] = useState(0); // 0,10,20
  const [activeIndex, setActiveIndex] = useState(0); // index within current window
  const [exhausted, setExhausted] = useState(false); // reached end of 30

  const { data, isLoading, isFetching, isError, refetch } = useDogBatch();

  // Redirect if no frame selected
  useEffect(() => {
    if (!selectedFrame) {
      router.push("/challenge/select-frame");
    }
  }, [selectedFrame, router]);

  // 최초 로딩: 셔플 후 버퍼 채우고 포인터 초기화
  useEffect(() => {
    if (data?.dogs?.length && buffer.length === 0) {
      const shuffled = shuffleDogs(data.dogs);
      setBuffer(shuffled);
      setWindowStart(0);
      setActiveIndex(0);
      setExhausted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  const visible = useMemo(
    () => buffer.slice(windowStart, windowStart + WINDOW_SIZE),
    [buffer, windowStart, WINDOW_SIZE]
  );
  const displayedCount = Math.min(windowStart + activeIndex + 1, buffer.length);

  const isInitialLoading = isLoading && buffer.length === 0;
  const isProcessingSelection = isFetching && buffer.length > 0;

  const handleNext = async () => {
    if (visible.length === 0 || isProcessingSelection) return;

    // move within current window of 10
    if (activeIndex < visible.length - 1) {
      setActiveIndex((i) => i + 1);
      return;
    }

    // move to next window of 10 if exists within batch
    if (windowStart + WINDOW_SIZE < buffer.length) {
      const nextStart = windowStart + WINDOW_SIZE;
      setWindowStart(nextStart);
      const nextLen = buffer.slice(nextStart, nextStart + WINDOW_SIZE).length;
      setActiveIndex(Math.min(0, nextLen - 1));
      return;
    }

    // reached end of 30
    setExhausted(true);
  };

  const handlePrevious = () => {
    if (visible.length === 0 || isProcessingSelection) return;
    if (activeIndex > 0) {
      setActiveIndex((i) => i - 1);
      return;
    }
    if (windowStart - WINDOW_SIZE >= 0) {
      const prevStart = windowStart - WINDOW_SIZE;
      setWindowStart(prevStart);
      const prevLen = buffer.slice(prevStart, prevStart + WINDOW_SIZE).length;
      setActiveIndex(Math.max(0, prevLen - 1));
    }
  };

  const handleReload = async () => {
    const res = await refetch();
    const list = res.data?.dogs ?? [];
    if (list.length) {
      const shuffled = shuffleDogs(list);
      setBuffer(shuffled);
      setWindowStart(0);
      setActiveIndex(0);
      setExhausted(false);
    }
  };

  const handleSelectDog = (dog: Dog) => {
    const currentDog = dog ?? visible[activeIndex];
    if (!currentDog) return;
    matchDog(currentDog);
    logDogMatched(currentDog.id, currentDog.name, "random");
    goToStep(2);
    nextStep();
    router.push("/challenge/upload-photos");
  };

  const subtitle = useMemo(() => {
    if (isInitialLoading) return "Gathering the sweetest faces for you...";
    if (exhausted) return "You’ve seen this set. Reload for more.";
    if (visible.length > 0) return "Swipe to meet more friends";
    return "Unable to load new dogs right now. Please try again.";
  }, [visible.length, isInitialLoading, exhausted]);

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

      {/* Carousel (10-window) */}
      <div className="mb-10">
        {isInitialLoading ? (
          <CarouselSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">
            <AlertTriangle className="h-10 w-10 text-[#ff6b5a]" />
            <p>We couldn&apos;t fetch new rescue dogs right now.</p>
            <p>Please try again in a moment.</p>
          </div>
        ) : visible.length > 0 ? (
          <div className="relative">
            <DogCarousel
              dogs={visible}
              activeIndex={activeIndex}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSelect={handleSelectDog}
              isProcessing={isProcessingSelection}
              disableChoose={false}
            />
            <button
              type="button"
              onClick={() => {
                if (isProcessingSelection) return;
                const nextStart = windowStart + WINDOW_SIZE;
                if (nextStart < buffer.length) {
                  setWindowStart(nextStart);
                  setActiveIndex(0);
                } else {
                  void handleReload();
                }
              }}
              className="absolute left-1/2 top-[-20px] z-10 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur-sm transition hover:bg-white"
            >
              <RefreshCw className="h-4 w-4" />
              {windowStart + WINDOW_SIZE < buffer.length ? "Rematch" : "Reload"}
            </button>
          </div>
        ) : (
          <CarouselSkeleton />
        )}
        {/* Bottom reload is removed in favor of floating button */}
      </div>

      {/* Info Box */}
      <div className="rounded-2xl bg-[#fff9f3] p-6">
        <h3 className="mb-3 text-lg font-semibold text-gray-900">What happens next?</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="text-[#ff6b5a]">•</span>
            <span>Swipe through up to 10 at a time. After 30, reload for a new set.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#ff6b5a]">•</span>
            <span>We&apos;ll help you craft a shareable frame that features them beautifully.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#ff6b5a]">•</span>
            <span>Every share increases the chance they find a loving home.</span>
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
