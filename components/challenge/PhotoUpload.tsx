/**
 * PhotoUpload Component
 * File picker with validation
 */

"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";
import { validateImageFile } from "@/lib/utils/file-validator";

interface PhotoUploadProps {
  onUpload: (file: File, frameId: string) => void; // Added frameId to associate uploads with frames
  onError: (error: string) => void;
  accept?: string;
  disabled?: boolean;
  frameId: string; // New prop to identify the frame
}

export default function PhotoUpload({
  onUpload,
  onError,
  accept = "image/jpeg,image/jpg,image/png,image/heic",
  disabled = false,
  frameId,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      onError(validation.error || "Invalid file");
      // Reset input
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    onUpload(file, frameId); // Pass frameId with the file

    // Reset input for next upload
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
        aria-label="Upload photo"
      />
      <button
        onClick={handleClick}
        disabled={disabled}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Upload className="h-5 w-5" />
        <span>Choose from Gallery</span>
      </button>
    </>
  );
}
