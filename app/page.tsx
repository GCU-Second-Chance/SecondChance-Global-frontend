/**
 * Landing Page
 * Main entry point for SecondChance Global
 */

import FeaturedDogs from "@/components/landing/FeaturedDogs";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import QuickStats from "@/components/landing/QuickStats";
import SuccessStories from "@/components/landing/SuccessStories";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Quick Stats */}
      <QuickStats />

      {/* How It Works */}
      <HowItWorks />

      {/* Success Stories */}
      <SuccessStories />

      {/* Featured Dogs */}
      <FeaturedDogs />
    </div>
  );
}
