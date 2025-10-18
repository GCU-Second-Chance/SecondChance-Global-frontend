/**
 * CameraCapture Component
 * Captures photos using device camera (MediaDevices API)
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, RotateCw, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

type CameraState = "idle" | "requesting" | "active" | "error";
type FacingMode = "user" | "environment";

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraState, setCameraState] = useState<CameraState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [facingMode, setFacingMode] = useState<FacingMode>("user");
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Request camera permission and start stream
  const startCamera = async (facing: FacingMode = "user") => {
    console.log("🎥 [Camera] Starting camera initialization...", { facing });
    setCameraState("requesting");
    setErrorMessage("");
    setIsVideoReady(false);

    try {
      // Stop existing stream if any
      if (streamRef.current) {
        console.log("🎥 [Camera] Stopping existing stream");
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      // Check available cameras first (parallel)
      console.log("🎥 [Camera] Enumerating devices...");
      const devicesPromise = navigator.mediaDevices.enumerateDevices();

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1920 },
        },
        audio: false,
      };

      console.log("🎥 [Camera] Requesting getUserMedia with constraints:", constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("🎥 [Camera] ✅ Stream received", {
        tracks: stream.getTracks().length,
        settings: stream.getVideoTracks()[0]?.getSettings(),
      });
      streamRef.current = stream;

      if (videoRef.current) {
        console.log("🎥 [Camera] Setting video srcObject");
        videoRef.current.srcObject = stream;

        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          console.log("🎥 [Camera] Video metadata loaded");
          videoRef.current
            ?.play()
            .then(() => {
              console.log("🎥 [Camera] ✅ Video playing successfully");
              setIsVideoReady(true);
              setCameraState("active");
            })
            .catch((playError) => {
              console.error("🎥 [Camera] ❌ Video play failed:", playError);
            });
        };

        // Add timeout in case onloadedmetadata never fires
        setTimeout(() => {
          if (!isVideoReady) {
            console.warn("🎥 [Camera] ⚠️ Video metadata timeout - forcing play");
            videoRef.current
              ?.play()
              .then(() => {
                setIsVideoReady(true);
                setCameraState("active");
              })
              .catch((err) => {
                console.error("🎥 [Camera] ❌ Forced play failed:", err);
              });
          }
        }, 3000);
      }

      // Check if device has multiple cameras (don't block video loading)
      const devices = await devicesPromise;
      const videoDevices = devices.filter((device) => device.kind === "videoinput");
      console.log("🎥 [Camera] Available cameras:", videoDevices.length);
      setHasMultipleCameras(videoDevices.length > 1);
    } catch (error) {
      console.error("🎥 [Camera] ❌ Error:", error);
      setCameraState("error");

      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          setErrorMessage(
            "Camera permission denied. Please allow camera access in your browser settings."
          );
        } else if (error.name === "NotFoundError") {
          setErrorMessage("No camera found on this device.");
        } else {
          setErrorMessage("Failed to access camera. Please try again.");
        }
      }
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Toggle between front and back camera
  const toggleCamera = () => {
    const newFacing = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacing);
    startCamera(newFacing);
  };

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const file = new File([blob], `photo_${Date.now()}.jpg`, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });

        onCapture(file);
        handleClose();
      },
      "image/jpeg",
      0.95
    );
  };

  // Handle close
  const handleClose = () => {
    stopCamera();
    onClose();
  };

  // Start camera on mount
  useEffect(() => {
    startCamera(facingMode);

    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Header */}
        <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent p-4">
          <h2 className="text-lg font-semibold text-white">Take a Photo</h2>
          <button
            onClick={handleClose}
            className="rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/30"
            aria-label="Close camera"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Camera View */}
        <div className="relative flex h-full w-full items-center justify-center">
          {/* Video Element (hidden until ready) */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`h-full w-full scale-x-[-1] object-cover transition-opacity duration-300 ${
              isVideoReady ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Loading State */}
          {(cameraState === "requesting" || !isVideoReady) && cameraState !== "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black text-white">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/30 border-t-white" />
              <p className="text-lg">Starting camera...</p>
              <p className="text-sm text-white/70">
                {cameraState === "requesting"
                  ? "Requesting permission..."
                  : "Initializing video..."}
              </p>
            </div>
          )}

          {/* Error State */}
          {cameraState === "error" && (
            <div className="max-w-md px-6 text-center">
              <Camera className="mx-auto mb-4 h-16 w-16 text-white/50" />
              <p className="mb-2 text-lg font-semibold text-white">Camera Error</p>
              <p className="mb-6 text-sm text-white/80">{errorMessage}</p>
              <button
                onClick={() => startCamera(facingMode)}
                className="rounded-lg bg-white px-6 py-3 font-semibold text-gray-900 transition-all hover:bg-gray-100"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Controls */}
        {cameraState === "active" && isVideoReady && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8">
            <div className="flex items-center justify-center gap-8">
              {/* Flip Camera Button */}
              {hasMultipleCameras && (
                <button
                  onClick={toggleCamera}
                  className="rounded-full bg-white/20 p-4 text-white backdrop-blur-sm transition-all hover:bg-white/30"
                  aria-label="Switch camera"
                >
                  <RotateCw className="h-6 w-6" />
                </button>
              )}

              {/* Capture Button */}
              <button
                onClick={capturePhoto}
                className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-transparent transition-all hover:bg-white/20"
                aria-label="Capture photo"
              >
                <div className="h-16 w-16 rounded-full bg-white" />
              </button>

              {/* Spacer for symmetry */}
              {hasMultipleCameras && <div className="w-14" />}
            </div>
          </div>
        )}

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />
      </motion.div>
    </AnimatePresence>
  );
}
