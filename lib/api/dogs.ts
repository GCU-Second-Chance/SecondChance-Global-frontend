import { fetcher } from "./fetcher";
import type { ApiSuccessResponse } from "./types";
import type { Dog } from "@/stores/types";
import { getDogById as getMockDogById, getRandomDog, mockDogs } from "@/data/dogs";

function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not defined. Please set it in your environment configuration."
    );
  }

  return baseUrl.replace(/\/$/, "");
}

interface GihoeApiDog {
  ID: number;
  Name: string;
  Age?: string | number | null;
  Images?: string[] | null;
  Gender?: string | null;
  Breed?: string | null;
  Location?: {
    Country?: string | null;
    City?: string | null;
  } | null;
  Shelter?: {
    Name?: string | null;
    Contact?: string | null;
    Email?: string | null;
  } | null;
  CountryType?: string | null;
}

type AgeRangeKey = "baby" | "young" | "adult" | "senior";

const AGE_RANGE_MAP: Record<string, AgeRangeKey> = {
  baby: "baby",
  young: "young",
  adult: "adult",
  senior: "senior",
};

const DEFAULT_COUNTRY_CANDIDATES = ["American", "Korean", "Japanese", "Chinese"] as const;

function normalizeAge(rawAge: string | number | null | undefined): {
  age: number | string;
  range?: AgeRangeKey;
} {
  if (typeof rawAge === "number" && !Number.isNaN(rawAge)) {
    return { age: rawAge };
  }

  if (typeof rawAge === "string") {
    const trimmed = rawAge.trim();
    const numericAge = Number(trimmed);

    if (!Number.isNaN(numericAge)) {
      return { age: numericAge };
    }

    const lower = trimmed.toLowerCase();
    if (AGE_RANGE_MAP[lower]) {
      const range = AGE_RANGE_MAP[lower];
      return { age: trimmed, range };
    }

    return { age: trimmed };
  }

  return { age: "Unknown" };
}

function normalizeGender(rawGender: string | null | undefined): Dog["gender"] {
  if (!rawGender) {
    return "unknown";
  }

  const normalized = rawGender.trim().toLowerCase();

  if (normalized === "male") {
    return "male";
  }

  if (normalized === "female") {
    return "female";
  }

  return "unknown";
}

function mapGihoeDog(apiDog: GihoeApiDog): Dog {
  const { age, range } = normalizeAge(apiDog.Age ?? null);
  const images = Array.isArray(apiDog.Images) ? apiDog.Images.filter(Boolean) : [];

  return {
    id: String(apiDog.ID),
    images,
    name: apiDog.Name?.trim() || "Unnamed",
    age,
    ageRange: range,
    gender: normalizeGender(apiDog.Gender ?? null),
    breed: apiDog.Breed?.trim() || undefined,
    location: {
      country: apiDog.Location?.Country?.trim() || "Unknown",
      city: apiDog.Location?.City?.trim() || "Unknown",
    },
    shelter: {
      name: apiDog.Shelter?.Name?.trim() || "Unknown Shelter",
      contact: apiDog.Shelter?.Contact?.trim() || "Contact unavailable",
      email: apiDog.Shelter?.Email?.trim() || undefined,
    },
    origin: apiDog.CountryType?.trim() || undefined,
  };
}

function isInternalDog(value: unknown): value is Dog {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<Dog>;
  return (
    typeof candidate.id === "string" &&
    Array.isArray(candidate.images) &&
    typeof candidate.name === "string" &&
    candidate.location !== undefined &&
    typeof candidate.location?.city === "string" &&
    typeof candidate.location?.country === "string"
  );
}

function isGihoeDog(value: unknown): value is GihoeApiDog {
  if (!value || typeof value !== "object") {
    return false;
  }

  return "Name" in value && "ID" in value;
}

function normalizeDogPayload(payload: unknown): Dog[] {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    const normalized: Dog[] = [];
    for (const item of payload) {
      if (isInternalDog(item)) {
        normalized.push(item);
      } else if (isGihoeDog(item)) {
        normalized.push(mapGihoeDog(item));
      }
    }
    return normalized;
  }

  if (typeof payload === "object") {
    if ("data" in payload) {
      // @ts-expect-error - runtime guard handles the shape
      return normalizeDogPayload((payload as { data: unknown }).data);
    }

    if ("dogs" in payload) {
      // @ts-expect-error - runtime guard handles the shape
      return normalizeDogPayload((payload as { dogs: unknown }).dogs);
    }

    if ("items" in payload) {
      // @ts-expect-error - runtime guard handles the shape
      return normalizeDogPayload((payload as { items: unknown }).items);
    }

    if (isInternalDog(payload)) {
      return [payload];
    }

    if (isGihoeDog(payload)) {
      return [mapGihoeDog(payload)];
    }
  }

  return [];
}

async function fetchRandomDogBatch(baseUrl: string): Promise<Dog[]> {
  const endpoint = `${baseUrl}/api/v1/dogs/random`;
  const payload = await fetcher<unknown>(endpoint);
  const dogs = normalizeDogPayload(payload);

  if (dogs.length === 0) {
    throw new Error(`[fetchRandomDogBatch] ${endpoint} returned no dogs.`);
  }

  return dogs;
}

export interface FetchDogsOptions {
  limit?: number;
  offset?: number;
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
 * GET /api/v1/dogs/random
 * Fetch batch of dogs for carousel view (returns ~40 random entries)
 */
export async function fetchDogs(options: FetchDogsOptions = {}): Promise<DogListResult> {
  const { limit = 30, offset = 0 } = options;
  const baseUrl = getApiBaseUrl();

  try {
    const allDogs = await fetchRandomDogBatch(baseUrl);
    const slicedDogs = allDogs.slice(offset, offset + limit);
    const total = allDogs.length;

    return {
      dogs: slicedDogs,
      meta: {
        total,
        limit,
        offset,
        page: limit > 0 ? Math.floor(offset / limit) + 1 : 1,
        totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
        hasMore: offset + limit < total,
      },
    };
  } catch (error) {
    console.warn("[fetchDogs] Random endpoint failed. Using mock data fallback:", error);
  }

  const fallbackDogs = mockDogs.slice(offset, offset + limit);

  return {
    dogs: fallbackDogs,
    meta: {
      total: mockDogs.length,
      limit,
      offset,
      page: limit > 0 ? Math.floor(offset / limit) + 1 : 1,
      totalPages: limit > 0 ? Math.ceil(mockDogs.length / limit) : 1,
      hasMore: offset + limit < mockDogs.length,
      isFallback: true,
    },
  };
}

/**
 * GET /api/v1/dogs/ (with JSON body)
 * Fetch a single dog by ID (requires country in request body)
 */
export async function fetchDogById(id: string, country?: string): Promise<Dog> {
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/api/v1/dogs/`;
  const candidateCountries = country
    ? [country]
    : [...DEFAULT_COUNTRY_CANDIDATES];
  const numericId = Number(id);
  const idPayload = Number.isNaN(numericId) ? id : numericId;

  for (const candidate of candidateCountries) {
    try {
      const payload = await fetcher<unknown>(endpoint, {
        method: "GET",
        body: JSON.stringify({ country: candidate, id: idPayload }),
      });
      const dogs = normalizeDogPayload(payload);
      if (dogs.length > 0) {
        return dogs[0]!;
      }
    } catch (error) {
      console.warn(`[fetchDogById] Attempt with country "${candidate}" failed:`, error);
    }
  }

  try {
    const allDogs = await fetchRandomDogBatch(baseUrl);
    const match = allDogs.find((dog) => dog.id === id);
    if (match?.origin && !candidateCountries.includes(match.origin)) {
      return fetchDogById(id, match.origin);
    }
    if (match) {
      return match;
    }
  } catch (error) {
    console.warn("[fetchDogById] Random dataset fallback failed:", error);
  }

  const fallback = getMockDogById(id);
  if (fallback) {
    return fallback;
  }

  throw new Error(`Dog with id "${id}" not found in API or fallback data.`);
}

/**
 * GET /dogs/random
 * Fetch a random dog for challenge matching
 */
export async function fetchRandomDog(): Promise<Dog> {
  const baseUrl = getApiBaseUrl();
  try {
    const dogs = await fetchRandomDogBatch(baseUrl);
    const withImages = dogs.filter((dog) => dog.images.length > 0);
    const pool = withImages.length > 0 ? withImages : dogs;
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex]!;
  } catch (error) {
    console.warn("[fetchRandomDog] Falling back to mock data due to request failure:", error);
    return getRandomDog();
  }
}

/**
 * POST /api/v1/challenge/:id/upload
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

  const baseUrl = getApiBaseUrl();
  const response = await fetcher<ApiSuccessResponse<ChallengeUploadResponse>>(
    `${baseUrl}/api/v1/challenge/${challengeId}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  return response.data;
}
