"use client";

/**
 * Photo Upload Page - Step 3
 * Upload or capture user photos for the challenge
 */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { useChallengeStore } from "@/stores";
import PhotoUpload from "@/components/challenge/PhotoUpload";
import { compressImage } from "@/lib/utils/file-validator";
import { logPhotoUploaded } from "@/lib/analytics";
import FrameLayout from "@/components/challenge/FrameLayout";
import { captureNodeToPng } from "@/lib/utils/capture";
import CameraCapture from "@/components/challenge/CameraCapture";

export default function UploadPhotosPage() {
  const router = useRouter();
  const {
    selectedFrame,
    matchedDog,
    photoSlots,
    setPhotoSlot,
    clearPhotoSlot,
    progress,
    nextStep,
    setResultImage,
  } = useChallengeStore();

  const [currentSlotIndex, setCurrentSlotIndex] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingResult, setIsGeneratingResult] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const frameRef = useRef<HTMLDivElement | null>(null);

  // Redirect if prerequisites not met
  useEffect(() => {
    if (!selectedFrame) {
      router.push("/challenge/select-frame");
    } else if (!matchedDog) {
      router.push("/challenge/match-dog");
    }
  }, [selectedFrame, matchedDog, router]);

  // Auto-select first empty user slot
  useEffect(() => {
    if (photoSlots.length > 0 && currentSlotIndex === null) {
      const firstEmptyUserSlot = photoSlots.find((slot) => slot.type === "user" && !slot.imageUrl);
      if (firstEmptyUserSlot) {
        setCurrentSlotIndex(firstEmptyUserSlot.index);
      }
    }
  }, [photoSlots, currentSlotIndex]);

  const handlePhotoUpload = async (file: File, uploadMethod: "camera" | "file") => {
    if (currentSlotIndex === null || !selectedFrame) return; // Ensure selectedFrame is available

    setIsProcessing(true);
    setError("");

    try {
      // Compress image
      const compressedFile = await compressImage(file);

      // Create URL for preview
      const imageUrl = URL.createObjectURL(compressedFile);

      // Update store
      setPhotoSlot(currentSlotIndex, imageUrl, compressedFile);

      // Log analytics
      logPhotoUploaded(currentSlotIndex, uploadMethod);

      // Move to next empty slot
      const nextEmptySlot = photoSlots.find(
        (slot) => slot.index > currentSlotIndex && slot.type === "user" && !slot.imageUrl
      );
      if (nextEmptySlot) {
        setCurrentSlotIndex(nextEmptySlot.index);
      } else {
        setCurrentSlotIndex(null);
      }
    } catch (err) {
      console.error("Photo upload error:", err);
      setError("Failed to process photo. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (file: File) => {
    handlePhotoUpload(file, "file");
  };

  const handleCameraCapture = (file: File) => {
    handlePhotoUpload(file, "camera");
    setIsCameraOpen(false);
  };

  const handleRemovePhoto = (index: number) => {
    clearPhotoSlot(index);
    setCurrentSlotIndex(index);
  };

  const handleSlotClick = (index: number) => {
    const slot = photoSlots[index];
    if (slot && slot.type === "user") {
      setCurrentSlotIndex(index);
    }
  };

  const handleContinue = async () => {
    if (!progress.photosCompleted || isProcessing || isGeneratingResult) {
      return;
    }

    if (!frameRef.current) {
      setError("Unable to prepare the result preview. Please try again.");
      return;
    }

    try {
      setIsGeneratingResult(true);

      const dataUrl = await captureNodeToPng(frameRef.current, {
        excludeSelectors: ["#remove"],
      });

      setResultImage(dataUrl);
      nextStep();
      router.push("/challenge/result");
    } catch (err) {
      console.error("Result generation error:", err);
      setError("Failed to generate the result. Please try again.");
    } finally {
      setIsGeneratingResult(false);
    }
  };

  if (!selectedFrame || !matchedDog) {
    return null;
  }

  const userSlots = photoSlots.filter((slot) => slot.type === "user");
  const filledSlotsCount = userSlots.filter((slot) => slot.imageUrl).length;
  const totalUserSlots = userSlots.length;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <motion.div
        className="mb-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Add Your Photos</h1>
        <p className="text-sm text-gray-600">
          Upload {totalUserSlots} photos to complete your challenge with {matchedDog.name}
        </p>
      </motion.div>

      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">
            {filledSlotsCount} of {totalUserSlots} photos
          </span>
          <span className="text-gray-500">
            {Math.round((filledSlotsCount / totalUserSlots) * 100)}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <motion.div
            className="h-full bg-[#ff6b5a]"
            initial={{ width: 0 }}
            animate={{ width: `${(filledSlotsCount / totalUserSlots) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Photo Grid - replaced with FrameLayout */}
      <div>
        <FrameLayout
          ref={frameRef}
          frameLayout={selectedFrame.frameLayout}
          frameId={selectedFrame.id}
          thumbnail={selectedFrame.thumbnail}
          frameSize={selectedFrame.frameSize}
          slotPositions={selectedFrame.slotPositions}
          photoSlots={photoSlots}
          currentSlotIndex={currentSlotIndex}
          onSlotClick={handleSlotClick}
          onRemove={handleRemovePhoto}
        />
      </div>

      {/* Upload Controls */}
      {currentSlotIndex !== null && (
        <motion.div
          className="mb-6  mt-6 space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-center text-lg font-medium text-gray-700">
            Add photo for slot {currentSlotIndex + 1}
          </p>

          {/* Camera Button */}
          <button
            onClick={() => setIsCameraOpen(true)}
            disabled={isProcessing}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#ff6b5a] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#ff5544] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Camera className="h-5 w-5" />
            <span>Take a Photo</span>
          </button>

          {/* File Upload Button */}
          <PhotoUpload
            onUpload={handleFileUpload}
            onError={setError}
            disabled={isProcessing}
            frameId={selectedFrame.id}
          />
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <button
          onClick={handleContinue}
          disabled={!progress.photosCompleted || isProcessing || isGeneratingResult}
          className={` mt-6 w-full rounded-full px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-all ${
            progress.photosCompleted && !isProcessing && !isGeneratingResult
              ? "bg-[#ff6b5a] hover:bg-[#ff5745] hover:shadow-md"
              : "cursor-not-allowed bg-gray-300"
          }`}
        >
          {isGeneratingResult
            ? "Preparing Result..."
            : isProcessing
              ? "Processing..."
              : "Continue to Result"}
        </button>
      </motion.div>

      {/* Tips */}
      <div className="mt-6 rounded-lg bg-[#fff9f3] p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-900">📸 Photo Tips</h3>
        <ul className="space-y-1 text-xs text-gray-700">
          <li>• Use good lighting for best results</li>
          <li>• Make sure your face is clearly visible</li>
          <li>• Try different poses and expressions</li>
          <li>• Have fun and be creative!</li>
        </ul>
      </div>
      {isCameraOpen && (
        <CameraCapture onCapture={handleCameraCapture} onClose={() => setIsCameraOpen(false)} />
      )}
    </div>
  );
}
