import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ChallengeStep, ChallengeStore, Dog, Frame, PhotoSlot } from "./types";

// Initial state
const initialState = {
  step: 1 as ChallengeStep,
  selectedFrame: null,
  matchedDog: null,
  photoSlots: [] as PhotoSlot[],
  progress: {
    frameSelected: false,
    dogMatched: false,
    photosCompleted: false,
    resultGenerated: false,
  },
  resultImageUrl: null,
};

export const useChallengeStore = create<ChallengeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ...initialState,

      // Step navigation
      goToStep: (step: ChallengeStep) => {
        set({ step });
      },

      nextStep: () => {
        const currentStep = get().step;
        if (currentStep < 4) {
          set({ step: (currentStep + 1) as ChallengeStep });
        }
      },

      previousStep: () => {
        const currentStep = get().step;
        if (currentStep > 1) {
          set({ step: (currentStep - 1) as ChallengeStep });
        }
      },

      // Frame selection
      selectFrame: (frame: Frame) => {
        // Initialize photo slots based on frame configuration
        const slots: PhotoSlot[] = [0, 1, 2, 3].map((index) => ({
          index,
          type: frame.dogSlots.includes(index) ? "dog" : "user",
          imageUrl: null,
        }));

        set({
          selectedFrame: frame,
          photoSlots: slots,
          progress: {
            ...get().progress,
            frameSelected: true,
          },
        });
      },

      // Dog matching
      matchDog: (dog: Dog) => {
        const { selectedFrame, photoSlots } = get();

        if (!selectedFrame) {
          console.error("No frame selected");
          return;
        }

        // Set dog image to the first dog slot
        const dogSlotIndex = selectedFrame.dogSlots[0];
        if (dogSlotIndex === undefined) {
          console.error("No dog slot found in frame");
          return;
        }

        const updatedSlots = photoSlots.map((slot) =>
          slot.index === dogSlotIndex ? { ...slot, imageUrl: dog.images[0] || null } : slot
        );

        set({
          matchedDog: dog,
          photoSlots: updatedSlots,
          progress: {
            ...get().progress,
            dogMatched: true,
          },
        });
      },

      // Photo management
      setPhotoSlot: (index: number, imageUrl: string, file?: File) => {
        const { photoSlots } = get();
        const updatedSlots = photoSlots.map((slot) =>
          slot.index === index ? { ...slot, imageUrl, file } : slot
        );

        // Check if all user slots are filled
        const allUserPhotosFilled = updatedSlots
          .filter((slot) => slot.type === "user")
          .every((slot) => slot.imageUrl !== null);

        set({
          photoSlots: updatedSlots,
          progress: {
            ...get().progress,
            photosCompleted: allUserPhotosFilled,
          },
        });
      },

      clearPhotoSlot: (index: number) => {
        const { photoSlots } = get();
        const updatedSlots = photoSlots.map((slot) =>
          slot.index === index ? { ...slot, imageUrl: null, file: undefined } : slot
        );

        // Check if all user slots are filled
        const allUserPhotosFilled = updatedSlots
          .filter((slot) => slot.type === "user")
          .every((slot) => slot.imageUrl !== null);

        set({
          photoSlots: updatedSlots,
          progress: {
            ...get().progress,
            photosCompleted: allUserPhotosFilled,
          },
        });
      },

      // Result generation
      setResultImage: (imageUrl: string) => {
        set({
          resultImageUrl: imageUrl,
          progress: {
            ...get().progress,
            resultGenerated: true,
          },
        });
      },

      // Reset entire flow
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: "challenge-storage", // LocalStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist certain fields (don't persist File objects)
      partialize: (state) => ({
        step: state.step,
        selectedFrame: state.selectedFrame,
        matchedDog: state.matchedDog,
        photoSlots: state.photoSlots.map((slot) => ({
          index: slot.index,
          type: slot.type,
          imageUrl: slot.imageUrl,
          // Don't persist File objects
        })),
        progress: state.progress,
        resultImageUrl: state.resultImageUrl,
      }),
    }
  )
);
