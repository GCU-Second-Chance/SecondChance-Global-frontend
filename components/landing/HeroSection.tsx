/**
 * Hero Section Component
 * Main landing page hero with title and CTA buttons
 * Matches Figma design with gradient background and animations
 */

"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white px-4 min-h-screen flex justify-center items-center py-6 md:py-12">
      <div className="container mx-auto max-w-md md:max-w-2xl">
        {/* Hero Image with Animation */}
        {/* <motion.div
          className="mb-4 overflow-hidden rounded-2xl md:mb-6 md:rounded-3xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="aspect-[4/3] w-full bg-gradient-to-br from-[#a8b67a] to-[#8a9460] p-6 md:p-8">
            <div className="flex h-full items-center justify-center text-white">
              <p className="text-sm md:text-lg">📸 Hero Image / Slideshow Area</p>
            </div>
          </div>
        </motion.div> */}

        {/* Main Heading with Animation */}
        <motion.h1
          className="mb-3 text-center text-2xl font-bold tracking-tight text-gray-900 md:mb-4 md:text-3xl lg:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Find Your New Best Friend
        </motion.h1>

        {/* Subtitle with Delay */}
        <motion.p
          className="mb-6 text-center text-sm text-gray-600 md:mb-8 md:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Discover dogs in need of loving homes. Our global platform connects you with shelters
          worldwide.
        </motion.p>

        {/* CTA Buttons with Stagger */}
        <motion.div
          className="flex flex-col gap-2 md:gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/challenge" className="w-full">
            <button className="w-full rounded-full bg-[#ff6b5a] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#ff5745] hover:shadow-md md:py-3.5 md:text-base">
              Start Challenge
            </button>
          </Link>
          <Link href="/challenge" className="w-full">
            <button className="w-full rounded-full bg-[#ffd4d4] px-6 py-3 text-sm font-semibold text-gray-900 transition-all hover:bg-[#ffc4c4] md:py-3.5 md:text-base">
              Learn More
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
