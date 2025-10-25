/**
 * Challenge Entry Page
 * Starting point for the challenge flow
 */

"use client";
export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useChallengeStore } from "@/stores";

export default function ChallengePage() {
  const router = useRouter();
  const { goToStep } = useChallengeStore();

  const handleStart = () => {
    goToStep(1);
    router.push("/challenge/select-frame");
  };

  return (
    <div className="container mx-auto max-w-md px-6 pt-32 ">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Hero Icon */}
        <div className="mb-6 text-7xl">❤️</div>

        {/* Title */}
        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          Give a Dog, <br /> Second Chance
        </h1>

        {/* Description */}
        <p className="mb-4 text-base text-gray-600">
          Connecting loving homes with dogs in need worldwide.
        </p>
        <p className="mb-8 text-xs text-gray-500">
          New: Try “Fortune of the day” on the final screen to add a short uplifting quote to your frame.
          We don’t store your images — previews live only on your device and can be lost if you refresh.
        </p>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full rounded-full bg-[#ff6b5a] px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-[#ff5745] hover:shadow-md"
        >
          Find Your New Best Friend
        </button>

        {/* Learn More Link */}
        <button
          onClick={() => router.push("/")}
          className="mt-4 text-sm font-semibold text-[#ff6b5a] underline hover:text-[#ff5745]"
        >
          Learn More About Us
        </button>
      </motion.div>
    </div>
  );
}
