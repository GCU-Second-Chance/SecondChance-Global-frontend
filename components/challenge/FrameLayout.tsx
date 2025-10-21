import React, { forwardRef } from "react";
import Image from "next/image";
import type { FrameSlotPosition, PhotoSlot } from "@/stores/types";

type FrameLayoutProps = {
  frameId: string;
  frameLayout: number;
  thumbnail: string;
  frameSize: {
    width: number;
    height: number;
  };
  photoSlots: PhotoSlot[];
  currentSlotIndex: number | null;
  onSlotClick: (index: number) => void;
  onRemove?: (index: number) => void;
  slotPositions: FrameSlotPosition[];
};

const FrameLayout = forwardRef<HTMLDivElement, FrameLayoutProps>(
  (
    {
      frameId,
      thumbnail,
      frameSize,
      photoSlots,
      currentSlotIndex,
      onSlotClick,
      onRemove,
      slotPositions,
    },
    ref
  ) => {
    const frameImageSrc = thumbnail;
    const { width, height } = frameSize;
    const sortedSlots = [...photoSlots].sort((a, b) => a.index - b.index);
    const slotPositionMap = new Map(slotPositions.map((position) => [position.index, position]));

    return (
      <div id="frame" className="flex w-full items-center justify-center bg-gray-100 py-4">
        <div
          ref={ref}
          className="relative w-full"
          style={{
            aspectRatio: `${width} / ${height}`,
            maxWidth: `${width}px`,
          }}
        >
          {/* Photo Slots */}
          <div className="absolute inset-0 z-10">
            {sortedSlots.map((slot) => {
              const position = slotPositionMap.get(slot.index);

              if (!position) {
                return null;
              }

              const computedStyle = {
                top: `${(position.top / height) * 100}%`,
                left: `${(position.left / width) * 100}%`,
                width: `${(position.width / width) * 100}%`,
                height: `${(position.height / height) * 100}%`,
                borderRadius: position.borderRadius ?? 12,
              };

              const shouldBypassOptimization =
                !!slot.imageUrl &&
                (slot.imageUrl.startsWith("blob:") || slot.imageUrl.startsWith("data:"));

              return (
                <div
                  key={slot.index}
                  className={`absolute overflow-hidden bg-white shadow-sm transition-shadow ${
                    slot.index === currentSlotIndex ? "ring-2 ring-[#ff6b5a]" : ""
                  }`}
                  onClick={() => onSlotClick(slot.index)}
                  style={computedStyle}
                >
                  {slot.imageUrl ? (
                    <Image
                      src={slot.imageUrl}
                      alt={`Photo slot ${slot.index}`}
                      fill
                      className="object-cover scale-x-[-1]"
                      unoptimized={shouldBypassOptimization}
                    />
                  ) : (
                    <div
                      className={`flex h-full w-full items-center justify-center text-[10px] font-medium sm:text-xs ${
                        slot.index === currentSlotIndex ? "text-[#ff6b5a]" : "text-gray-500"
                      }`}
                    >
                      {slot.index === currentSlotIndex ? "Selected Slot" : "Empty Slot"}
                    </div>
                  )}
                  {onRemove && slot.type === "user" && (
                    <button
                      id="remove"
                      className="absolute top-2 right-2 rounded-full bg-red-300 px-2 py-1 text-xs text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(slot.index);
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          {/* Frame PNG Overlay */}
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <Image
              src={frameImageSrc}
              alt={`Frame layout for ${frameId}`}
              fill
              sizes={`(max-width: ${width}px) 100vw, ${width}px`}
              style={{ objectFit: "contain" }}
              className="pointer-events-none"
              priority
            />
          </div>
        </div>
      </div>
    );
  }
);

FrameLayout.displayName = "FrameLayout";
export default FrameLayout;
