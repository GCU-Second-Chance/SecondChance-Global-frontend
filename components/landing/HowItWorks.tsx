/**
 * How It Works Section Component
 * 3-step process with scroll-in-view animations
 */

"use client";

import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Create Your Challenge",
      description: "Choose a frame and get matched with a rescue dog",
      icon: "🎨",
    },
    {
      number: "2",
      title: "Share on Social Media",
      description: "Post your photo to spread awareness",
      icon: "📱",
    },
    {
      number: "3",
      title: "Make a Connection",
      description: "Help dogs find their forever homes",
      icon: "❤️",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-[#fff9f3] to-white py-16 md:py-20">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">How It Works</h2>
          <p className="text-lg text-gray-600">Three simple steps to make a difference</p>
        </motion.div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              {/* Step Card */}
              <div className="relative z-10 flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all hover:shadow-xl">
                {/* Step Number Badge */}
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#F5503D] to-[#ff7a5c] text-2xl font-bold text-white shadow-lg">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mb-4 text-6xl">{step.icon}</div>

                {/* Title */}
                <h3 className="mb-3 text-xl font-bold text-gray-900">{step.title}</h3>

                {/* Description */}
                <p className="text-gray-600">{step.description}</p>
              </div>

              {/* Arrow (except last item) */}
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-1/3 z-0 hidden -translate-y-1/2 translate-x-1/2 md:block">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    className="text-gray-300"
                  >
                    <path
                      d="M15 10 L25 20 L15 30"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
