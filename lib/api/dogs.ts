import { fetcher } from "./fetcher";
import type { Dog } from "@/stores/types";
import type { ApiSuccessResponse } from "./types";

/**
 * API Base URL (from environment variable)
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * GET /api/dogs/:id
 * Fetch a single dog by ID
 */
export async function fetchDogById(id: string): Promise<Dog> {
  const response = await fetcher<ApiSuccessResponse<Dog>>(`${API_BASE_URL}/dogs/${id}`);
  return response.data;
}

/**
 * GET /api/dogs/random
 * Fetch a random dog for challenge matching
 */
export async function fetchRandomDog(): Promise<Dog> {
  const response = await fetcher<ApiSuccessResponse<Dog>>(`${API_BASE_URL}/dogs/random`);
  return response.data;
}

/**
 * POST /api/challenge/:id/upload
 * Upload challenge photos (expires after 48 hours)
 */
export interface ChallengeUploadRequest {
  photos: File[];
}

export interface ChallengeUploadResponse {
  uploads: Array<{
    url: string;
    filename: string;
    size: number;
  }>;
  expiresAt: string; // ISO 8601 timestamp
}

export async function uploadChallengePhotos(
  challengeId: string,
  photos: File[]
): Promise<ChallengeUploadResponse> {
  const formData = new FormData();

  // Append all photos to FormData
  photos.forEach((photo) => {
    formData.append("photos", photo);
  });

  const response = await fetcher<ApiSuccessResponse<ChallengeUploadResponse>>(
    `${API_BASE_URL}/challenge/${challengeId}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  return response.data;
}
