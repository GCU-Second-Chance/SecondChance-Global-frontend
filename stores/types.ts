/**
 * Challenge Flow Types
 * Types for the photo challenge flow state management
 */

// Frame types
export interface Frame {
  id: string;
  name: string;
  thumbnail: string;
  frameLayout: 1 | 2;
  dogSlots: number[]; // Indices where dog photos go (0-3)
  userSlots: number[]; // Indices where user photos go (0-3)
  // Decorative properties for themed frames
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string; // Text color for bottom text
  frameSize: {
    width: number;
    height: number;
  };
  slotPositions: FrameSlotPosition[];
}

export interface FrameSlotPosition {
  index: number;
  top: number;
  left: number;
  width: number;
  height: number;
  borderRadius?: number;
}

// Dog types
export interface Dog {
  id: string;
  images: string[];
  name: string;
  age: number | string;
  ageRange?: "baby" | "young" | "adult" | "senior";
  gender: "male" | "female" | "unknown";
  breed?: string;
  location: {
    country: string;
    city: string;
  };
  shelter: {
    name: string;
    contact: string;
    email?: string;
  };
  createdAt?: string;
  origin?: string;
}

// Photo slot types
export interface PhotoSlot {
  index: number; // 0-3
  type: "dog" | "user";
  imageUrl: string | null;
  file?: File; // Original file for user photos
}

// Challenge step type
export type ChallengeStep = 1 | 2 | 3 | 4;

// Challenge flow state
export interface ChallengeState {
  // Current step in the flow (1: frame, 2: dog, 3: photos, 4: result)
  step: ChallengeStep;

  // Selected frame
  selectedFrame: Frame | null;

  // Matched dog
  matchedDog: Dog | null;

  // Photo slots (4 slots total)
  photoSlots: PhotoSlot[];

  // Progress tracking
  progress: {
    frameSelected: boolean;
    dogMatched: boolean;
    photosCompleted: boolean;
    resultGenerated: boolean;
  };

  // Result data
  resultImageUrl: string | null;
}

// Challenge actions
export interface ChallengeActions {
  // Step navigation
  goToStep: (step: ChallengeStep) => void;
  nextStep: () => void;
  previousStep: () => void;

  // Frame selection
  selectFrame: (frame: Frame) => void;

  // Dog matching
  matchDog: (dog: Dog) => void;

  // Photo management
  setPhotoSlot: (index: number, imageUrl: string, file?: File) => void;
  clearPhotoSlot: (index: number) => void;

  // Result generation
  setResultImage: (imageUrl: string) => void;

  // Reset entire flow
  reset: () => void;
}

// Combined store type
export type ChallengeStore = ChallengeState & ChallengeActions;
