/**
 * File Validation Utilities
 * Validates image files for photo upload
 */

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/heic", "image/heif"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

/**
 * Validate image file
 * @param file - File to validate
 * @returns Validation result with error message if invalid
 */
export function validateImageFile(file: File): FileValidationResult {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: "Invalid file type. Please upload JPG, PNG, or HEIC images only.",
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / 1024 / 1024).toFixed(2);
    return {
      valid: false,
      error: `File size (${sizeMB}MB) exceeds the 10MB limit.`,
    };
  }

  return { valid: true };
}

/**
 * Convert HEIC to JPEG (browser doesn't natively support HEIC)
 * This is a placeholder - actual conversion would require a library like heic2any
 */
export async function convertHeicToJpeg(file: File): Promise<File> {
  // For now, return the file as-is
  // In production, use heic2any library:
  // import heic2any from 'heic2any';
  // const convertedBlob = await heic2any({ blob: file, toType: 'image/jpeg' });
  // return new File([convertedBlob], file.name.replace(/\.heic$/i, '.jpg'), { type: 'image/jpeg' });

  return file;
}

/**
 * Get image dimensions
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.width,
        height: img.height,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

/**
 * Fix image orientation based on EXIF data
 * This handles images taken on mobile devices with incorrect orientation
 */
export function fixImageOrientation(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // For now, just return the original file
        // In production, read EXIF orientation and rotate accordingly
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to create blob"));
              return;
            }
            const fixedFile = new File([blob], file.name, { type: file.type });
            resolve(fixedFile);
          },
          file.type,
          0.95
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Compress image if too large
 */
export function compressImage(
  file: File,
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 0.85
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to create blob"));
              return;
            }
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
