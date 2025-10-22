import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchDogById,
  fetchDogs,
  fetchRandomDog,
  uploadChallengePhotos,
} from "@/lib/api/dogs";
import type { DogListResult, FetchDogsOptions } from "@/lib/api/dogs";
import type { Dog } from "@/stores/types";

/**
 * React Query Keys
 */
export const dogKeys = {
  all: ["dogs"] as const,
  list: (limit: number, offset: number) => [...dogKeys.all, "list", limit, offset] as const,
  detail: (id: string, country?: string) =>
    (country
      ? [...dogKeys.all, "detail", id, country]
      : [...dogKeys.all, "detail", id]) as const,
  random: () => [...dogKeys.all, "random"] as const,
};

/**
 * Hook: Fetch list of dogs (batched for carousel)
 */
export function useDogBatch(options: FetchDogsOptions = {}) {
  const { limit = 30, offset = 0 } = options;

  return useQuery<DogListResult, Error>({
    queryKey: dogKeys.list(limit, offset),
    queryFn: () => fetchDogs({ limit, offset }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes cache retention
    retry: 2,
  });
}

/**
 * Hook: Fetch dog by ID
 */
export function useDog(id: string, country?: string) {
  return useQuery<Dog, Error>({
    queryKey: dogKeys.detail(id, country),
    queryFn: () => fetchDogById(id, country),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}

/**
 * Hook: Fetch random dog
 */
export function useRandomDog() {
  return useQuery<Dog, Error>({
    queryKey: dogKeys.random(),
    queryFn: fetchRandomDog,
    staleTime: 0, // Always fetch fresh random dog
    retry: 3,
  });
}

/**
 * Hook: Upload challenge photos
 */
export function useUploadChallengePhotos() {
  return useMutation({
    mutationFn: ({ challengeId, photos }: { challengeId: string; photos: File[] }) =>
      uploadChallengePhotos(challengeId, photos),
    onError: (error: Error) => {
      console.error("Failed to upload challenge photos:", error);
    },
  });
}
