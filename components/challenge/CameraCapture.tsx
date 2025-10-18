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

  // Request camera permission and start stream
  const startCamera = async (facing: FacingMode = "user") => {
    setCameraState("requesting");
    setErrorMessage("");

    try {
      // Stop existing stream if any
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1920 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setCameraState("active");

      // Check if device has multiple cameras
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device) => device.kind === "videoinput");
      setHasMultipleCameras(videoDevices.length > 1);
    } catch (error) {
      console.error("Camera error:", error);
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
          {cameraState === "active" && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
          )}

          {cameraState === "requesting" && (
            <div className="flex flex-col items-center gap-4 text-white">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white" />
              <p>Accessing camera...</p>
            </div>
          )}

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
        {cameraState === "active" && (
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
