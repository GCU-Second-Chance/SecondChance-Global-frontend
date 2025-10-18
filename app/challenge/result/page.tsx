/**
 * Result Page - Step 4
 * Final result generation, download, and sharing
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Download, RefreshCw, Share2 } from "lucide-react";
import Image from "next/image";
import { useChallengeStore } from "@/stores";
import { downloadImage, renderPhotoFrame } from "@/lib/canvas-renderer";
import { logResultDownloaded, logShareCompleted } from "@/lib/analytics";

export default function ResultPage() {
  const router = useRouter();
  const { selectedFrame, matchedDog, photoSlots, resultImageUrl, setResultImage, progress } =
    useChallengeStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>("");
  const [isSharing, setIsSharing] = useState(false);

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

  // Generate result on mount
  useEffect(() => {
    if (selectedFrame && matchedDog && progress.photosCompleted && !resultImageUrl) {
      generateResult();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFrame, matchedDog, progress.photosCompleted]);

  const generateResult = async () => {
    if (!selectedFrame || !matchedDog) return;

    setIsGenerating(true);
    setError("");

    try {
      const dataUrl = await renderPhotoFrame({
        frame: selectedFrame,
        photoSlots: photoSlots,
        dog: matchedDog,
        outputWidth: 1080,
      });

      setResultImage(dataUrl);
    } catch (err) {
      console.error("Result generation error:", err);
      setError("Failed to generate result. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

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
      // Convert data URL to blob
      const response = await fetch(resultImageUrl);
      const blob = await response.blob();
      const file = new File([blob], `secondchance_${matchedDog.id}.png`, {
        type: "image/png",
      });

      // Share text
      const shareText = `🐾 ${matchedDog.name} is looking for a forever home!

Help this rescue dog find their second chance 💛

📍 ${matchedDog.location.city}, ${matchedDog.location.country}
🏠 ${matchedDog.shelter.name}

#SecondChanceGlobal #AdoptDontShop #${matchedDog.name}

👉 Scan the QR code to learn more!`;

      // Check if Web Share API is supported
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `Help ${matchedDog.name} find a home!`,
          text: shareText,
          files: [file],
        });

        // Log analytics
        logShareCompleted(matchedDog.id, matchedDog.name, "web_share");
      } else {
        // Fallback: Copy link
        const dogUrl = `${window.location.origin}/dog/${matchedDog.id}`;
        await navigator.clipboard.writeText(dogUrl);
        alert("Link copied to clipboard! Share it with your friends.");

        // Log analytics
        logShareCompleted(matchedDog.id, matchedDog.name, "link_copy");
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
        {isGenerating ? (
          <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-gray-100">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-[#ff6b5a]" />
              <p className="text-sm text-gray-600">Generating your masterpiece...</p>
            </div>
          </div>
        ) : resultImageUrl ? (
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src={resultImageUrl}
              alt="Challenge result"
              width={1080}
              height={1080}
              className="h-auto w-full"
              priority
            />
          </div>
        ) : error ? (
          <div className="flex aspect-square w-full flex-col items-center justify-center rounded-2xl bg-red-50 p-8">
            <p className="mb-4 text-center text-red-700">{error}</p>
            <button
              onClick={generateResult}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        ) : null}
      </motion.div>

      {/* Action Buttons */}
      {resultImageUrl && !isGenerating && (
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
