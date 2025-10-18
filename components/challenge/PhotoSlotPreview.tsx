/**
 * PhotoSlotPreview Component
 * Displays photo slot with preview or placeholder
 */

"use client";

import Image from "next/image";
import { Camera, ImageIcon, X } from "lucide-react";
import type { PhotoSlot } from "@/stores/types";

interface PhotoSlotPreviewProps {
  slot: PhotoSlot;
  onRemove?: () => void;
  onClick?: () => void;
  isActive?: boolean;
}

export default function PhotoSlotPreview({
  slot,
  onRemove,
  onClick,
  isActive = false,
}: PhotoSlotPreviewProps) {
  const hasImage = !!slot.imageUrl;
  const isDogSlot = slot.type === "dog";

  return (
    <div
      className={`relative overflow-hidden rounded-lg border-2 transition-all ${
        isActive
          ? "border-[#ff6b5a] ring-2 ring-[#ff6b5a]/20"
          : hasImage
            ? "border-gray-200"
            : "border-dashed border-gray-300"
      } ${onClick && !isDogSlot ? "cursor-pointer hover:border-gray-400" : ""}`}
      onClick={!isDogSlot && onClick ? onClick : undefined}
      role={onClick && !isDogSlot ? "button" : undefined}
      tabIndex={onClick && !isDogSlot ? 0 : undefined}
      aria-label={`Photo slot ${slot.index + 1}`}
    >
      {/* Photo Preview */}
      {hasImage && slot.imageUrl ? (
        <div className="relative aspect-square w-full">
          <Image
            src={slot.imageUrl}
            alt={`Slot ${slot.index + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />

          {/* Dog Slot Badge */}
          {isDogSlot && (
            <div className="absolute left-2 top-2 rounded-full bg-[#ffe8e0] px-2 py-1 text-xs font-semibold text-[#ff6b5a]">
              Rescue Dog
            </div>
          )}

          {/* Remove Button (only for user slots) */}
          {!isDogSlot && onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white transition-all hover:bg-black/70"
              aria-label="Remove photo"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        /* Placeholder */
        <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 bg-gray-50 p-4">
          {isDogSlot ? (
            <>
              <ImageIcon className="h-8 w-8 text-gray-400" />
              <span className="text-xs text-gray-500">Dog Photo</span>
            </>
          ) : (
            <>
              <Camera className="h-8 w-8 text-gray-400" />
              <span className="text-xs text-center text-gray-500">Tap to add photo</span>
            </>
          )}
        </div>
      )}

      {/* Slot Number Indicator */}
      <div className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-gray-700 shadow-sm">
        {slot.index + 1}
      </div>
    </div>
  );
}
