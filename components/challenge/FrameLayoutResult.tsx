import React, { forwardRef } from "react";
import Image from "next/image";
import type { FrameSlotPosition, PhotoSlot } from "@/stores/types";

type FrameLayoutProps = {
  photos: PhotoSlot[];
  frameLayout: number;
  frameId: string;
  thumbnail: string;
  frameSize: {
    width: number;
    height: number;
  };
  slotPositions: FrameSlotPosition[];
};

const FrameLayoutResult = forwardRef<HTMLDivElement, FrameLayoutProps>(
  ({ photos, frameLayout, frameId, thumbnail, frameSize, slotPositions }, ref) => {
    const frameImageSrc = thumbnail;
    const sortedPhotos = [...photos].sort((a, b) => a.index - b.index);
    const { width, height } = frameSize;
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
            {sortedPhotos.map((slot) => {
              const position = slotPositionMap.get(slot.index);

              if (!position || !slot.imageUrl) {
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
                  className="absolute overflow-hidden bg-white"
                  style={computedStyle}
                >
                  {slot.imageUrl && (
                    <Image
                      src={slot.imageUrl}
                      alt={`Photo slot ${slot.index}`}
                      fill
                      className="object-cover scale-x-[-1]"
                      unoptimized={shouldBypassOptimization}
                    />
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
              width={width}
              height={height}
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

FrameLayoutResult.displayName = "FrameLayoutResult";
export default FrameLayoutResult;
