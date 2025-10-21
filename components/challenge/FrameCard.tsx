/**
 * Frame Card Component
 * Displays a single frame option with preview
 */

"use client";

import { motion } from "framer-motion";
import type { Frame } from "@/stores/types";
import Image from "next/image";

interface FrameCardProps {
  frame: Frame;
  isSelected: boolean;
  onSelect: () => void;
}

export default function FrameCard({ frame, isSelected, onSelect }: FrameCardProps) {
  // Generate frame preview based on template

  return (
    <motion.button
      onClick={onSelect}
      className={`relative w-full rounded-lg border-2 p-4 transition-all ${
        isSelected ? "border-[#ff6b5a] bg-[#e5bfb7]" : "border-gray-300 bg-gray-100"
      }`}
      whileTap={{ scale: 0.98 }}
      aria-label={`Select ${frame.name} frame`}
      aria-pressed={isSelected}
    >
      {/* Frame Preview Image */}
      <div className="relative w-full h-48 overflow-hidden rounded-md">
        <Image
          src={frame.thumbnail}
          alt={frame.name}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 100vw, 400px"
        />
      </div>

      {/* Frame Name */}
      <p className="mt-2 text-center text-sm font-medium text-gray-700">{frame.name}</p>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 rounded-full bg-[#ff6b5a] px-2 py-1 text-xs font-semibold text-white">
          Selected
        </div>
      )}
    </motion.button>
  );
}
