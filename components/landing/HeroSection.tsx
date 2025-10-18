/**
 * Hero Section Component
 * Main landing page hero with title and CTA buttons
 * Matches Figma design with gradient background and animations
 */

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fff4e6] via-[#fff9f3] to-white py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main Heading with Animation */}
          <motion.h1
            className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Find Your New Best Friend
          </motion.h1>

          {/* Subtitle with Delay */}
          <motion.p
            className="mb-8 text-lg text-gray-600 md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover dogs in need of loving homes. Our global platform connects you with shelters
            worldwide.
          </motion.p>

          {/* CTA Buttons with Stagger */}
          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/challenge">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Start Your Search
              </Button>
            </Link>
            <Link href="/challenge">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </motion.div>

          {/* Hero Image Placeholder with Animation */}
          <motion.div
            className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-[#ffe5db] to-[#fff0ea] shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="aspect-video w-full bg-gradient-to-br from-gray-100 to-gray-200 p-8">
              <div className="flex h-full items-center justify-center text-gray-400">
                <p className="text-lg">📸 Hero Image / Slideshow Area</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
