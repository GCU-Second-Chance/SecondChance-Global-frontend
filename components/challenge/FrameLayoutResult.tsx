"use client";
import React, { forwardRef, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { Dog, FrameSlotPosition, PhotoSlot } from "@/stores/types";
import { buildShareText, buildShareUrl } from "@/lib/utils/share";
import { toQrDataUrl } from "@/lib/utils/qr";
import { getOverlayLayout } from "@/lib/utils/frame-overlay";

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
  matchedDog?: Dog | null;
  showOverlays?: boolean;
};

const FrameLayoutResult = forwardRef<HTMLDivElement, FrameLayoutProps>(
  (
    { photos, frameId, thumbnail, frameSize, slotPositions, matchedDog, showOverlays = true },
    ref
  ) => {
    const frameImageSrc = thumbnail;
    const sortedPhotos = [...photos].sort((a, b) => a.index - b.index);
    const { width, height } = frameSize;
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
                  className="absolute overflow-hidden bg-white shadow-sm transition-shadow"
                  style={computedStyle}
                >
                  {slot.imageUrl && (
                    <div className="absolute inset-0 scale-x-[-1]">
                      <Image
                        src={slot.imageUrl}
                        alt={`Photo slot ${slot.index}`}
                        fill
                        className="object-cover"
                        unoptimized={shouldBypassOptimization}
                      />
                    </div>
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

FrameLayoutResult.displayName = "FrameLayoutResult";
export default FrameLayoutResult;
