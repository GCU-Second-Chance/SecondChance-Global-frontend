import React, { forwardRef } from "react";
import Image from "next/image";
import type { PhotoSlot } from "@/stores/types";

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
    },
    ref
  ) => {
    const frameImageSrc = thumbnail;
    const { width, height } = frameSize;
    const sortedSlots = [...photoSlots].sort((a, b) => a.index - b.index);

    const responsiveScaleClass =
      frameLayout === 1 ? "scale-[0.85] origin-top sm:scale-100" : "scale-100";

    const innerFrameSectionStyle = (() => {
      switch (frameLayout) {
        case 1:
          return "w-full h-full z-20 px-[14px] pt-[14px] pb-[90px] grid grid-rows-2 grid-cols-2 gap-[14px]";
        case 2:
          return "w-full h-full z-20 px-[10.5px] pt-[10.5px] pb-[76px] grid grid-cols-1 grid-rows-4 gap-[10.5px]";
        default:
          return ""; // No style for unsupported layouts
      }
    })();

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
          <div className={`absolute inset-0 z-10 ${innerFrameSectionStyle} p-3`}>
            {sortedSlots.map((slot) => {
              const shouldBypassOptimization =
                !!slot.imageUrl &&
                (slot.imageUrl.startsWith("blob:") || slot.imageUrl.startsWith("data:"));

              return (
                <div
                  key={slot.index}
                  className={`relative  w-full h-full  overflow-hidden bg-white `}
                  onClick={() => onSlotClick(slot.index)}
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
                      className={` ${slot.index === currentSlotIndex ? "text-primary" : "text-gray-500"} flex items-center justify-center h-full`}
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
