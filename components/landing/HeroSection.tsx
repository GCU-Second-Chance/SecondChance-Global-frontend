/**
 * Hero Section Component
 * Main landing page hero with title and CTA buttons
 */

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-primary-50 to-white py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main Heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Every Share is a <span className="text-primary">Second Chance</span>
          </h1>

          {/* Subtitle */}
          <p className="mb-8 text-lg text-gray-600 md:text-xl">
            유기견과 함께하는 특별한 인생네컷 챌린지
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/challenge"
              className="w-full rounded-lg bg-primary px-8 py-4 text-center font-semibold text-white shadow-lg transition-all hover:bg-primary-600 hover:shadow-xl sm:w-auto"
            >
              🎨 챌린지 시작하기
            </Link>
            <Link
              href="/dogs"
              className="w-full rounded-lg border-2 border-gray-300 bg-white px-8 py-4 text-center font-semibold text-gray-700 transition-all hover:border-primary hover:text-primary sm:w-auto"
            >
              🐕 유기견 만나기
            </Link>
          </div>

          {/* Placeholder for slideshow */}
          <div className="mt-12 rounded-2xl bg-gray-100 p-8 shadow-inner">
            <p className="text-gray-500">📸 슬라이드쇼 영역 (3초 자동 전환)</p>
          </div>
        </div>
      </div>
    </section>
  );
}
