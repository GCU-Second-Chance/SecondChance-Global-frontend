"use client";
import React, { forwardRef, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { Dog, FrameSlotPosition, PhotoSlot } from "@/stores/types";
import { buildShareText, buildShareUrl } from "@/lib/utils/share";
import { toQrDataUrl } from "@/lib/utils/qr";
import { getOverlayLayout } from "@/lib/utils/frame-overlay";

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
  matchedDog?: Dog | null;
  showOverlays?: boolean;
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
      matchedDog,
      showOverlays = true,
    },
    ref
  ) => {
    const frameImageSrc = thumbnail;
    const { width, height } = frameSize;
    const sortedSlots = [...photoSlots].sort((a, b) => a.index - b.index);
    const slotPositionMap = new Map(slotPositions.map((position) => [position.index, position]));

    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
    const infoText = useMemo(() => (matchedDog ? buildShareText(matchedDog) : ""), [matchedDog]);
    const { cfg, bandStyle } = useMemo(() => getOverlayLayout({ width, height }), [width, height]);
    const { overlayTextClass, overlayBgClass } = useMemo(() => {
      const isLightFrame = frameId.toLowerCase().includes("white");
      return {
        overlayTextClass: isLightFrame ? "text-black" : "text-white",
        overlayBgClass: isLightFrame ? "bg-white/70" : "bg-black/40",
      };
    }, [frameId]);
    useEffect(() => {
      let cancelled = false;
      async function gen() {
        if (!matchedDog) {
          setQrDataUrl(null);
          return;
        }
        try {
          const url = buildShareUrl(matchedDog);
          const dataUrl = await toQrDataUrl(url, cfg.qrGeneratePx);
          if (!cancelled) setQrDataUrl(dataUrl);
        } catch {
          if (!cancelled) setQrDataUrl(null);
        }
      }
      gen();
      return () => {
        cancelled = true;
      };
    }, [matchedDog, cfg.qrGeneratePx]);

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
                    <div className="absolute inset-0 scale-x-[-1]">
                      <Image
                        src={slot.imageUrl}
                        alt={`Photo slot ${slot.index}`}
                        fill
                        className="object-cover"
                        unoptimized={shouldBypassOptimization}
                      />
                    </div>
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

          {/* Info + QR overlays (above frame) */}
          {showOverlays && (
            <div className="absolute inset-0 z-30 pointer-events-none select-none">
              {/* Bottom overlay band sized relative to frame: 90px of 600px => 15% */}
              <div
                className="absolute left-0 right-0 bottom-0 flex items-end gap-2 px-2 pb-2 md:px-3 md:pb-3"
                style={bandStyle}
              >
                {matchedDog && (
                  <div
                    className={`pointer-events-auto flex-1 overflow-hidden rounded ${overlayBgClass} p-1 md:p-2 ${overlayTextClass}`}
                  >
                    <div className="whitespace-pre-line text-[9px] leading-tight md:text-xs">
                      {infoText}
                    </div>
                  </div>
                )}
                {qrDataUrl && (
                  <div className="pointer-events-auto  absolute  right-[12.5px] bottom-[12.5px]   bg-white p-[1.5px]">
                    <Image src={qrDataUrl} alt="QR" width={32} height={32} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

FrameLayout.displayName = "FrameLayout";
export default FrameLayout;
