/**
 * Frame Card Component
 * Displays a single frame option with preview
 */

"use client";

import { motion } from "framer-motion";
import type { Frame } from "@/stores/types";

interface FrameCardProps {
  frame: Frame;
  isSelected: boolean;
  onSelect: () => void;
}

export default function FrameCard({ frame, isSelected, onSelect }: FrameCardProps) {
  // Generate frame preview based on template
  const renderFramePreview = () => {
    const slots = [0, 1, 2, 3];

    switch (frame.template) {
      case "2x2":
        return (
          <div className="grid grid-cols-2 gap-1">
            {slots.map((index) => (
              <div
                key={index}
                className={`aspect-square rounded ${
                  frame.dogSlots.includes(index) ? "bg-[#ffe8e0]" : "bg-gray-200"
                }`}
              >
                {frame.dogSlots.includes(index) && (
                  <div className="flex h-full items-center justify-center text-2xl">🐕</div>
                )}
              </div>
            ))}
          </div>
        );

      case "4x1":
        return (
          <div className="flex flex-col gap-1">
            {slots.map((index) => (
              <div
                key={index}
                className={`aspect-[4/1] rounded ${
                  frame.dogSlots.includes(index) ? "bg-[#ffe8e0]" : "bg-gray-200"
                }`}
              >
                {frame.dogSlots.includes(index) && (
                  <div className="flex h-full items-center justify-center text-xl">🐕</div>
                )}
              </div>
            ))}
          </div>
        );

      case "1x4":
        return (
          <div className="grid grid-cols-4 gap-1">
            {slots.map((index) => (
              <div
                key={index}
                className={`aspect-square rounded ${
                  frame.dogSlots.includes(index) ? "bg-[#ffe8e0]" : "bg-gray-200"
                }`}
              >
                {frame.dogSlots.includes(index) && (
                  <div className="flex h-full items-center justify-center text-lg">🐕</div>
                )}
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.button
      onClick={onSelect}
      className={`w-full rounded-2xl border-2 p-4 transition-all ${
        isSelected
          ? "border-[#ff6b5a] bg-[#fff5f3] shadow-md"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
      whileTap={{ scale: 0.98 }}
      aria-label={`Select ${frame.name} frame`}
      aria-pressed={isSelected}
    >
      {/* Frame Preview */}
      <div className="mb-3">{renderFramePreview()}</div>

      {/* Frame Name */}
      <div className="text-center">
        <h3 className={`text-sm font-semibold ${isSelected ? "text-[#ff6b5a]" : "text-gray-900"}`}>
          {frame.name}
        </h3>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="mt-2 flex items-center justify-center">
          <div className="rounded-full bg-[#ff6b5a] px-3 py-1 text-xs font-semibold text-white">
            Selected
          </div>
        </div>
      )}
    </motion.button>
  );
}
