/**
 * Frame Selection Page - Step 1
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useChallengeStore } from "@/stores";
import { frames } from "@/data/frames";
import FrameCard from "@/components/challenge/FrameCard";
import type { Frame } from "@/stores/types";

export default function SelectFramePage() {
  const router = useRouter();
  const { selectedFrame, selectFrame, nextStep } = useChallengeStore();
  const [localSelection, setLocalSelection] = useState<Frame | null>(selectedFrame);

  useEffect(() => {
    // Sync with store on mount
    if (selectedFrame) {
      setLocalSelection(selectedFrame);
    }
  }, [selectedFrame]);

  const handleSelect = (frame: Frame) => {
    setLocalSelection(frame);
  };

  const handleContinue = () => {
    if (localSelection) {
      selectFrame(localSelection);
      nextStep();
      router.push("/challenge/match-dog");
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = localSelection
        ? frames.findIndex((f) => f.id === localSelection.id)
        : -1;

      if (e.key === "ArrowRight" && currentIndex < frames.length - 1) {
        setLocalSelection(frames[currentIndex + 1] ?? null);
      } else if (e.key === "ArrowLeft" && currentIndex > 0) {
        setLocalSelection(frames[currentIndex - 1] ?? null);
      } else if (e.key === "Enter" && localSelection) {
        if (localSelection) {
          selectFrame(localSelection);
          nextStep();
          router.push("/challenge/match-dog");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [localSelection, selectFrame, nextStep, router]);

  return (
    <div className="container mx-auto max-w-md px-4 py-8">
      {/* Header */}
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Choose Your Frame</h1>
        <p className="text-sm text-gray-600">Select a layout for your photo challenge</p>
      </motion.div>

      {/* Frame Grid */}
      <div className="mb-8 space-y-4">
        {frames.map((frame, index) => (
          <motion.div
            key={frame.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <FrameCard
              frame={frame}
              isSelected={localSelection?.id === frame.id}
              onSelect={() => handleSelect(frame)}
            />
          </motion.div>
        ))}
      </div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <button
          onClick={handleContinue}
          disabled={!localSelection}
          className={`w-full rounded-full px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-all ${
            localSelection
              ? "bg-[#ff6b5a] hover:bg-[#ff5745] hover:shadow-md"
              : "cursor-not-allowed bg-gray-300"
          }`}
        >
          Continue
        </button>
      </motion.div>

      {/* Keyboard Hints */}
      <div className="mt-4 text-center text-xs text-gray-500">
        💡 Use arrow keys to navigate, Enter to continue
      </div>
    </div>
  );
}
