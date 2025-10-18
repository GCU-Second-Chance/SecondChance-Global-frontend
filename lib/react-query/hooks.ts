import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchDogById, fetchRandomDog, uploadChallengePhotos } from "@/lib/api/dogs";
import type { Dog } from "@/stores/types";

/**
 * React Query Keys
 */
export const dogKeys = {
  all: ["dogs"] as const,
  detail: (id: string) => [...dogKeys.all, "detail", id] as const,
  random: () => [...dogKeys.all, "random"] as const,
};

/**
 * Hook: Fetch dog by ID
 */
export function useDog(id: string) {
  return useQuery<Dog, Error>({
    queryKey: dogKeys.detail(id),
    queryFn: () => fetchDogById(id),
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
