/**
 * Result Page - Step 4
 * Final result generation, download, and sharing
 */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Download, Share2 } from "lucide-react";
import { useChallengeStore } from "@/stores";
import FrameLayoutResult from "@/components/challenge/FrameLayoutResult";
import { logResultDownloaded, logShareCompleted } from "@/lib/analytics";

export default function ResultPage() {
  const router = useRouter();
  const { selectedFrame, matchedDog, resultImageUrl, progress, photoSlots } = useChallengeStore();
  const [isSharing, setIsSharing] = useState(false);
  const dataUrlToFile = useCallback((dataUrl: string, filename: string) => {
    const [header, base64Data] = dataUrl.split(",");
    if (!header || !base64Data) {
      throw new Error("Invalid data URL");
    }

    const mimeMatch = header.match(/data:(.*?);base64/);
    const mime = mimeMatch?.[1] ?? "image/png";
    const binary = atob(base64Data);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      array[i] = binary.charCodeAt(i);
    }
    return new File([array], filename, { type: mime });
  }, []);

  function downloadImage(dataUrl: string, filename: string) {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Redirect if prerequisites not met
  useEffect(() => {
    if (!selectedFrame) {
      router.push("/challenge/select-frame");
    } else if (!matchedDog) {
      router.push("/challenge/match-dog");
    } else if (!progress.photosCompleted) {
      router.push("/challenge/upload-photos");
    }
  }, [selectedFrame, matchedDog, progress, router]);

  // Remove unnecessary image generation logic
  useEffect(() => {
    if (!resultImageUrl) {
      router.push("/challenge/upload-photos");
    }
  }, [resultImageUrl, router]);

  const filledPhotos = useMemo(
    () => photoSlots.filter((slot) => slot.imageUrl !== null),
    [photoSlots]
  );

  const handleDownload = () => {
    if (!resultImageUrl || !matchedDog) return;

    const filename = `secondchance_${matchedDog.id}_${Date.now()}.png`;
    downloadImage(resultImageUrl, filename);

    // Log analytics
    logResultDownloaded(matchedDog.id, selectedFrame?.id || "");
  };

  const handleShare = async () => {
    if (!resultImageUrl || !matchedDog) return;

    setIsSharing(true);

    try {
      const filename = `secondchance_${matchedDog.id}.png`;
      const file = dataUrlToFile(resultImageUrl, filename);
      const shareUrl = `${window.location.origin}/dog/${matchedDog.id}`;

      // Share text
      const shareText = `🐾 ${matchedDog.name} is looking for a forever home!

Help this rescue dog find their second chance 💛

📍 ${matchedDog.location.city}, ${matchedDog.location.country}
🏠 ${matchedDog.shelter.name}

#SecondChanceGlobal #AdoptDontShop #${matchedDog.name}

👉 Scan the QR code to learn more!`;

      const supportsShare =
        typeof navigator !== "undefined" && typeof navigator.share === "function";
      const canShareFiles = navigator.canShare?.({ files: [file] }) ?? false;

      if (supportsShare) {
        try {
          const shareData = canShareFiles
            ? {
                title: `Help ${matchedDog.name} find a home!`,
                text: shareText,
                files: [file],
              }
            : {
                title: `Help ${matchedDog.name} find a home!`,
                text: shareText,
                url: shareUrl,
              };

          await navigator.share(shareData);

          // Log analytics
          logShareCompleted(
            matchedDog.id,
            matchedDog.name,
            canShareFiles ? "web_share" : "web_share_text"
          );
          return;
        } catch (shareError) {
          // If user cancels, just exit quietly
          if ((shareError as DOMException)?.name === "AbortError") {
            return;
          }
          console.error("Share error via Web Share API:", shareError);
        }
      }

      try {
        // Fallback: Copy link
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard! Share it with your friends.");

        // Log analytics
        logShareCompleted(matchedDog.id, matchedDog.name, "link_copy");
      } catch (clipboardError) {
        console.error("Clipboard share error:", clipboardError);
        // Last resort fallback: download
        handleDownload();
      }
    } catch (err) {
      console.error("Share error:", err);
      // Fallback: Just download
      handleDownload();
    } finally {
      setIsSharing(false);
    }
  };

  const handleStartNew = () => {
    router.push("/challenge");
  };

  if (!selectedFrame || !matchedDog) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <motion.div
        className="mb-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Your Challenge is Complete! 🎉</h1>
        <p className="text-gray-600">Share this to help {matchedDog.name} find a home</p>
      </motion.div>

      {/* Result Preview */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {resultImageUrl && filledPhotos.length === photoSlots.length ? (
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <FrameLayoutResult
              photos={photoSlots}
              frameLayout={selectedFrame.frameLayout}
              frameId={selectedFrame.id}
              thumbnail={selectedFrame.thumbnail}
              frameSize={selectedFrame.frameSize}
            />
          </div>
        ) : (
          <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-gray-100">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-[#ff6b5a]" />
              <p className="text-sm text-gray-600">Generating your masterpiece...</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Action Buttons */}
      {resultImageUrl && (
        <motion.div
          className="mb-6 space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Share Button (Primary) */}
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#ff6b5a] px-6 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-[#ff5544] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Share2 className="h-5 w-5" />
            <span>{isSharing ? "Sharing..." : "Share Now"}</span>
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-gray-300 bg-white px-6 py-4 text-base font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
          >
            <Download className="h-5 w-5" />
            <span>Download Image</span>
          </button>
        </motion.div>
      )}

      {/* Stats */}
      {resultImageUrl && (
        <motion.div
          className="mb-6 rounded-lg bg-[#fff9f3] p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="mb-3 text-center text-lg font-semibold text-gray-900">
            You&apos;re making a difference! 💛
          </h3>
          <p className="mb-4 text-center text-sm text-gray-700">
            Every share increases the chance of {matchedDog.name} finding a loving home.
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[#ff6b5a]">1</div>
              <div className="text-xs text-gray-600">Dog Helped</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#ff6b5a]">4</div>
              <div className="text-xs text-gray-600">Photos Shared</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#ff6b5a]">∞</div>
              <div className="text-xs text-gray-600">Hope Created</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Start New Challenge */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <button
          onClick={handleStartNew}
          className="text-sm font-semibold text-[#ff6b5a] underline hover:text-[#ff5544]"
        >
          Help Another Dog
        </button>
      </motion.div>

      {/* QR Info */}
      <motion.div
        className="mt-8 rounded-lg border-2 border-dashed border-gray-300 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <p className="text-center text-xs text-gray-600">
          📱 The QR code in your image leads directly to {matchedDog.name}&apos;s profile. Anyone
          who scans it can learn more about this amazing dog!
        </p>
      </motion.div>
    </div>
  );
}
