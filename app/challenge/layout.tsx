/**
 * Challenge Flow Layout
 * Multi-step layout with stepper, back button, and auto-save
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useChallengeStore } from "@/stores";

export default function ChallengeLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { step, reset } = useChallengeStore();

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
      router.back();
    } else {
      router.push("/");
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
          <div className="mt-3 text-center text-sm text-gray-600">Step {step} of 4</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
