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
    <section className="bg-white px-4 py-8 md:py-12">
      <div className="container mx-auto max-w-md md:max-w-2xl">
        <motion.div
          className="mb-6 text-left md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-2 text-xl font-bold text-gray-900 md:text-2xl">Quick Stats</h2>
        </motion.div>

        {/* Featured Stat Card */}
        <motion.div
          className="mb-4 flex items-center gap-3 rounded-2xl bg-gray-50 p-4 shadow-sm md:mb-6 md:gap-4 md:p-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex-shrink-0">
            <div className="h-12 w-12 overflow-hidden rounded-xl bg-gray-200 md:h-16 md:w-16">
              <div className="flex h-full items-center justify-center text-2xl md:text-3xl">🐕</div>
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-0.5 text-xl font-bold text-gray-900 md:mb-1 md:text-2xl">
              <CountUpAnimation end={12000} suffix="+ Dogs Rescued" />
            </div>
            <div className="text-xs text-gray-600 md:text-sm">Across 50+ countries</div>
          </div>
        </motion.div>

        {/* Grid Stats */}
        <div className="grid gap-3 md:grid-cols-2 md:gap-4">
          {stats.slice(1).map((stat, index) => (
            <motion.div
              key={stat.label}
              className="rounded-2xl bg-gray-50 p-4 text-center shadow-sm transition-all hover:shadow-md md:p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
            >
              <div className="mb-2 text-3xl md:mb-3 md:text-4xl">{stat.icon}</div>
              <CountUpAnimation end={stat.value} suffix={stat.suffix} />
              <div className="mt-1 text-xs text-gray-600 md:mt-2 md:text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
