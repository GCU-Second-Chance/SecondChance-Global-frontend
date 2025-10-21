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
      frameLayout,
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

    const responsiveScaleClass =
      frameLayout === 1 ? "scale-[0.85] origin-top sm:scale-100" : "scale-100";

    return (
      <div
        className={`flex bg-gray-100 items-center justify-center w-full py-4 ${responsiveScaleClass}`}
      >
        <div
          ref={ref}
          className="relative flex items-center justify-center"
          style={{ width, height }}
        >
          {/* Photo Slots */}
          <div className="absolute inset-0 z-10">
            {sortedSlots.map((slot) => {
              const position = slotPositionMap.get(slot.index);

              if (!position) {
                return null;
              }

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
                  style={{
                    top: position.top,
                    left: position.left,
                    width: position.width,
                    height: position.height,
                    borderRadius: position.borderRadius,
                  }}
                >
                  {slot.imageUrl ? (
                    <Image
                      src={slot.imageUrl}
                      alt={`Photo slot ${slot.index}`}
                      fill
                      className="object-cover "
                      unoptimized={shouldBypassOptimization}
                    />
                  ) : (
                    <div
                      className={`flex h-full w-full items-center justify-center text-xs font-medium ${
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
            <div className="w-full h-full relative">
              <Image
                src={frameImageSrc}
                alt={`Frame layout for ${frameId}`}
                fill
                style={{ objectFit: "contain" }}
                className="pointer-events-none"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

FrameLayout.displayName = "FrameLayout";
export default FrameLayout;
