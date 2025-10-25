/**
 * Landing Page
 * Main entry point for SecondChance Global
 */

import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import QuickStats from "@/components/landing/QuickStats";
import Vision from "@/components/landing/Vision";
import RandomDogs from "@/components/landing/RandomDogs";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Vision */}
      <Vision />

      {/* Quick Stats */}
      <QuickStats />

      {/* How It Works */}
      <HowItWorks />

      {/* Random Dogs */}
      <RandomDogs />
    </div>
  );
}
