/**
 * Quick Stats Section Component
 * Displays key metrics with countup animation
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface StatItem {
  label: string;
  value: number;
  suffix: string;
  icon: string;
}

const stats: StatItem[] = [
  { label: "Total Shares", value: 15234, suffix: "", icon: "�" },
  { label: "Successful Adoptions", value: 127, suffix: "", icon: "❤️" },
  { label: "Countries Participating", value: 23, suffix: "", icon: "🌍" },
];

function CountUpAnimation({
  end,
  suffix,
  duration = 2,
}: {
  end: number;
  suffix: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Easing function (easeOutCubic)
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const currentCount = Math.floor(end * easeOutCubic(progress));

      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView]);

  return (
    <div ref={ref} className="text-4xl font-bold text-gray-900 md:text-5xl">
      {count.toLocaleString()}
      {suffix}
    </div>
  );
}

export default function QuickStats() {
  return (
    <section className="bg-gradient-to-b from-white to-[#fff9f3] py-16 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Our Impact</h2>
          <p className="text-lg text-gray-600">Together, we&apos;re making a difference</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all hover:shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="mb-4 text-5xl">{stat.icon}</div>
              <CountUpAnimation end={stat.value} suffix={stat.suffix} />
              <div className="mt-2 text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
