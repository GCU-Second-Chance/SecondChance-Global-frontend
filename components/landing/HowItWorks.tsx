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
      title: "Search",
      description: "Browse our extensive database of dogs from shelters around the world.",
      icon: "🔍",
      bgColor: "bg-[#ffe8e0]",
    },
    {
      number: "2",
      title: "Connect",
      description:
        "Reach out to shelters directly to learn more about a dog and the adoption process.",
      icon: "❤️",
      bgColor: "bg-[#ffd4d4]",
    },
    {
      number: "3",
      title: "Adopt",
      description:
        "Complete the adoption process with the shelter and welcome your new family member.",
      icon: "🏠",
      bgColor: "bg-[#ffe8e0]",
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
          <h2 className="mb-2 text-xl font-bold text-gray-900 md:text-2xl">How It Works</h2>
        </motion.div>

        {/* Steps */}
        <div className="space-y-4 md:space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex gap-3 md:gap-4">
                {/* Icon Circle */}
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full md:h-12 md:w-12 ${step.bgColor}`}
                >
                  <span className="text-xl md:text-2xl">{step.icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 pb-4 md:pb-6">
                  <h3 className="mb-1.5 text-base font-bold text-gray-900 md:mb-2 md:text-lg">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
