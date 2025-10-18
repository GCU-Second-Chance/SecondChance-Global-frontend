/**
 * Featured Dogs Section Component
 * Displays urgent rescue cases matching Figma design
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function FeaturedDogs() {
  // Mock data - will be replaced with real data later
  const featuredDogs = [
    {
      id: 1,
      name: "Buddy",
      age: 2,
      image: "🐕",
    },
    {
      id: 2,
      name: "Daisy",
      age: 1,
      image: "🐶",
    },
    {
      id: 3,
      name: "Rocky",
      age: 4,
      image: "🦮",
    },
    {
      id: 4,
      name: "Coco",
      age: 2,
      image: "🐕‍🦺",
    },
  ];

  return (
    <section className="bg-white px-4 py-8 md:py-12">
      <div className="container mx-auto max-w-md md:max-w-2xl">
        {/* Section Title */}
        <motion.div
          className="mb-6 text-left md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-2 text-xl font-bold text-gray-900 md:text-2xl">Urgent Cases</h2>
        </motion.div>

        {/* Dogs Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {featuredDogs.map((dog, index) => (
            <motion.div
              key={dog.id}
              className="group relative overflow-hidden rounded-2xl bg-gray-50 shadow-sm transition-all hover:shadow-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
            >
              {/* Image Placeholder */}
              <div className="flex h-36 items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-5xl transition-transform group-hover:scale-105 md:h-48 md:text-6xl">
                {dog.image}
              </div>

              {/* Content */}
              <div className="p-3 md:p-4">
                <h3 className="mb-1 text-base font-bold text-gray-900 md:text-lg">{dog.name}</h3>
                <div className="mb-3 text-xs text-gray-600 md:text-sm">{dog.age} years old</div>
                <Link href={`/dog/${dog.id}`}>
                  <button className="w-full rounded-full bg-[#ff6b5a] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#ff5745] md:text-sm">
                    Help Now
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
