/**
 * Success Stories Section Component
 * Displays adoption success stories matching Figma design
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function SuccessStories() {
  // Mock data - will be replaced with real data later
  const stories = [
    {
      id: 1,
      dogName: "Luna",
      owner: "The Smiths",
      location: "Spain",
      story: "The Smiths found their perfect match in Luna, a rescue from Spain.",
      image: "🐕",
    },
    {
      id: 2,
      dogName: "Max",
      owner: "The Johnsons",
      location: "USA",
      story: "Max, once abandoned, is now cherished by the Johnsons in California.",
      image: "🐶",
    },
  ];

  return (
    <section className="bg-[#fff9f3] px-4 py-8 md:py-12">
      <div className="container mx-auto max-w-md md:max-w-2xl">
        {/* Section Header */}
        <motion.div
          className="mb-6 flex items-center justify-between md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-bold text-gray-900 md:text-2xl">Success Stories</h2>
          <Link
            href="/stories"
            className="text-sm font-semibold text-[#ff6b5a] hover:text-[#ff5745] md:text-base"
          >
            View More
          </Link>
        </motion.div>

        {/* Stories Grid */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Image Placeholder */}
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-[#ffe8e0] to-[#ffd4d4] text-6xl md:h-48 md:text-7xl">
                {story.image}
              </div>

              {/* Content */}
              <div className="p-4 md:p-5">
                <h3 className="mb-1 text-base font-bold text-gray-900 md:text-lg">
                  From Shelter to Sofa
                </h3>
                <p className="text-xs text-gray-600 md:text-sm">{story.story}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
