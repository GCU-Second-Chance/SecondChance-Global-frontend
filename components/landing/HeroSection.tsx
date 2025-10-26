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
    <section className="relative overflow-hidden min-h-screen flex justify-center items-center px-4 py-6 md:py-12 bg-gradient-to-b from-[#fff7f5] via-white to-white">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#ffe1da] opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-[#ffd4d4] opacity-50 blur-3xl" />
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
          Giving Dogs a Second Chance
        </motion.h1>

        {/* Subtitle with Delay */}
        <motion.p
          className="mb-6 text-center text-sm text-gray-700 md:mb-8 md:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Build a global culture of adoption. Discover and share rescue dogs from shelters across
          the world.
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
          <Link href="#discover" className="w-full">
            <button className="w-full rounded-full bg-white/80 backdrop-blur px-6 py-3 text-sm font-semibold text-gray-900 ring-1 ring-gray-200 transition-all hover:bg-white md:py-3.5 md:text-base">
              Discover Dogs
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
