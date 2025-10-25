"use client";

import { motion } from "framer-motion";

export default function Vision() {
  const items = [
    {
      title: "Build a global culture of adoption.",
      icon: "🌍",
      bg: "bg-[#ffe8e0]",
    },
    {
      title: "Browse our extensive database of dogs from shelters around the world.",
      icon: "🔍",
      bg: "bg-[#ffd4d4]",
    },
    {
      title:
        "Empower small private shelters to easily register data and help build public stray dog data APIs.",
      icon: "🤝",
      bg: "bg-[#ffe8e0]",
    },
  ];

  return (
    <section className="bg-white px-4 py-8 md:py-12">
      <div className="container mx-auto max-w-md md:max-w-2xl">
        <motion.div
          className="mb-6 text-left md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-2 text-xl font-bold text-gray-900 md:text-2xl">Our Vision</h2>
          <p className="text-sm text-gray-600 md:text-base">
            Every share is a second chance. Here’s what we’re building.
          </p>
        </motion.div>

        <div className="space-y-3 md:space-y-4">
          {items.map((item, idx) => (
            <motion.div
              key={item.title}
              className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4 shadow-sm md:gap-4 md:p-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
            >
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${item.bg} md:h-12 md:w-12`}>
                <span className="text-xl md:text-2xl">{item.icon}</span>
              </div>
              <div className="flex-1 pt-1 text-sm text-gray-800 md:text-base">{item.title}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

