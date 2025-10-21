import { fetcher } from "./fetcher";
import type { Dog } from "@/stores/types";
import type { ApiSuccessResponse } from "./types";
import { mockDogs } from "@/data/dogs";

/**
 * API Base URL (from environment variable)
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export interface FetchDogsOptions {
  limit?: number;
  offset?: number;
  seed?: string;
}

export interface DogListMeta {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  offset?: number;
  hasMore?: boolean;
  isFallback?: boolean;
}

export interface DogListResult {
  dogs: Dog[];
  meta: DogListMeta;
}

/**
 * GET /api/dogs
 * Fetch batch of dogs for carousel view
 */
export async function fetchDogs(options: FetchDogsOptions = {}): Promise<DogListResult> {
  const { limit = 30, offset = 0, seed } = options;
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  if (seed) {
    params.set("seed", seed);
  }

  const endpoint = `${API_BASE_URL}/dogs?${params.toString()}`;

  try {
    const response = await fetcher<ApiSuccessResponse<Dog[]>>(endpoint);

    const meta: DogListMeta = {
      ...response.meta,
      limit,
      offset,
      hasMore:
        typeof response.meta?.total === "number"
          ? offset + limit < response.meta.total
          : undefined,
    };

    return {
      dogs: response.data,
      meta,
    };
  } catch (error) {
    // Fallback to mock data in development scenarios
    console.warn("[fetchDogs] Falling back to mock data due to request failure:", error);
    const fallbackDogs = mockDogs.slice(offset, offset + limit);

    return {
      dogs: fallbackDogs,
      meta: {
        total: mockDogs.length,
        limit,
        offset,
        page: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(mockDogs.length / limit),
        hasMore: offset + limit < mockDogs.length,
        isFallback: true,
      },
    };
  }
}

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
