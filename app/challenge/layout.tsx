/**
 * Challenge Flow Layout
 * Multi-step layout with stepper, back button, and auto-save
 */

"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useChallengeStore } from "@/stores";

type StepConfig = {
  step: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  path: string;
};

const STEP_CONFIG: StepConfig[] = [
  {
    step: 1,
    title: "Choose Your Frame",
    subtitle: "Pick the layout that best fits your story",
    path: "/challenge/select-frame",
  },
  {
    step: 2,
    title: "Meet Your Match",
    subtitle: "Swipe through rescue dogs and pick your partner",
    path: "/challenge/match-dog",
  },
  {
    step: 3,
    title: "Add Your Photos",
    subtitle: "Upload or snap pictures to complete the collage",
    path: "/challenge/upload-photos",
  },
  {
    step: 4,
    title: "Share & Celebrate",
    subtitle: "Review the final collage and spread the word",
    path: "/challenge/result",
  },
];

export default function ChallengeLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { step, reset, previousStep } = useChallengeStore();

  const stepConfig = useMemo(
    () => (STEP_CONFIG.find((item) => item.step === step) ?? STEP_CONFIG[0]) as StepConfig,
    [step]
  );

  // Auto-save to localStorage (handled by Zustand persist middleware)

  // Beforeunload handler (only after step 2)
  useEffect(() => {
    if (step >= 3) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "";
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }
    return undefined;
  }, [step]);

  const handleBack = () => {
    if (step > 1) {
      const targetStep = (step - 1) as 1 | 2 | 3 | 4;
      previousStep();
      const targetRoute =
        STEP_CONFIG.find((config) => config.step === targetStep)?.path || "/challenge";
      router.push(targetRoute);
    } else {
      reset();
      router.push("/challenge");
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to start over? All progress will be lost.")) {
      reset();
      router.push("/challenge");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header with Back Button and Stepper */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="container mx-auto max-w-md px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back</span>
            </button>

            {/* Step Indicator */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`h-2 w-8 rounded-full transition-all ${
                    stepNum <= step ? "bg-[#ff6b5a]" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>

            {/* Reset Button (only visible after step 1) */}
            {step > 1 && (
              <button
                onClick={handleReset}
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Reset
              </button>
            )}
          </div>

          {/* Step Label */}
          <div className="mt-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#ff6b5a]">
              Step {step} of 4
            </p>
            <h2 className="mt-1 text-lg font-semibold text-gray-900">{stepConfig.title}</h2>
            <p className="mt-1 text-xs text-gray-500">{stepConfig.subtitle}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
