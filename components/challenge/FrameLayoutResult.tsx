import React, { forwardRef } from "react";
import Image from "next/image";
import type { PhotoSlot } from "@/stores/types";

type FrameLayoutProps = {
  photos: PhotoSlot[];
  frameLayout: number;
  frameId: string;
  thumbnail: string;
  frameSize: {
    width: number;
    height: number;
  };
};

const FrameLayoutResult = forwardRef<HTMLDivElement, FrameLayoutProps>(
  ({ photos, frameLayout, frameId, thumbnail, frameSize }, ref) => {
    const frameImageSrc = thumbnail;
    const sortedPhotos = [...photos].sort((a, b) => a.index - b.index);
    const { width, height } = frameSize;

    const frameLayoutStyle = (() => {
      switch (frameLayout) {
        case 1:
          return "w-[400px] h-[600px]"; // Horizontal layout
        case 2:
          return "w-[200px] h-[600px]"; // Vertical layout
        default:
          return ""; // No style for unsupported layouts
      }
    })();

    const responsiveScaleClass =
      frameLayout === 1 ? "scale-[0.85] origin-top sm:scale-100" : "scale-100";

    const innerFrameSectionStyle = (() => {
      switch (frameLayout) {
        case 1:
          return "w-full h-full z-20 px-[14px] pt-[14px] pb-[90px] grid grid-rows-2 grid-cols-2 gap-[14px]";
        case 2:
          return "w-full h-full z-20 px-[10.5px] pt-[10.5px] pb-[76px] grid grid-cols-1 grid-rows-4 gap-10.5px]";
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
          className={`relative  flex items-center justify-center ${frameLayoutStyle} `}
          style={{ width, height }}
        >
          {/* Photo Slots */}
          <div className={`absolute inset-0 z-10 ${innerFrameSectionStyle} p-3`}>
            {sortedPhotos.map((slot) => {
              const shouldBypassOptimization =
                !!slot.imageUrl &&
                (slot.imageUrl.startsWith("blob:") || slot.imageUrl.startsWith("data:"));

              return (
                <div
                  key={slot.index}
                  className={`relative  w-full h-full rounded-md  overflow-hidden bg-white `}
                >
                  {slot.imageUrl && (
                    <Image
                      src={slot.imageUrl}
                      alt={`Photo slot ${slot.index}`}
                      fill
                      className="object-cover "
                      unoptimized={shouldBypassOptimization}
                    />
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

FrameLayoutResult.displayName = "FrameLayoutResult";
export default FrameLayoutResult;
