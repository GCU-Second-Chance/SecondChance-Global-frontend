/**
 * Dog Detail Page
 * Displays detailed information about a rescue dog
 * Main destination for QR code scans
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, Heart, Mail, MapPin, Phone, Share2, Sparkles } from "lucide-react";
import { getDogById } from "@/data/dogs";
import type { Dog } from "@/stores/types";
import { logChallengeConversion, logDogShared, logQRScanned } from "@/lib/analytics";

function getAgeDisplay(age: Dog["age"]): string {
  if (typeof age === "number") {
    return `${age} year${age === 1 ? "" : "s"} old`;
  }

  return String(age);
}

function getAgeDescriptor(age: Dog["age"]): string {
  if (typeof age === "number") {
    return `${age}-year-old`;
  }

  return `${String(age).toLowerCase()}`;
}

interface DogDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function DogDetailPage({ params }: DogDetailPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dog, setDog] = useState<Dog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fromChallenge = searchParams.get("from") === "challenge";

  useEffect(() => {
    // Unwrap params Promise
    params.then((resolvedParams) => {
      // Fetch dog data
      const fetchedDog = getDogById(resolvedParams.id);
      setDog(fetchedDog || null);
      setIsLoading(false);

      // Log QR scan if coming from challenge
      if (fromChallenge && fetchedDog) {
        logQRScanned(fetchedDog.id, "challenge_result");
      } else if (fetchedDog) {
        logQRScanned(fetchedDog.id, "social_share");
      }
    });
  }, [params, fromChallenge]);

  const handleShare = async () => {
    if (!dog) return;

    const url = window.location.href;
    const ageDescriptor = getAgeDescriptor(dog.age);
    const shareText = `🐾 Meet ${dog.name}! This ${ageDescriptor} rescue dog is looking for a loving home.

📍 ${dog.location.city}, ${dog.location.country}
🏠 ${dog.shelter.name}

Help ${dog.name} find their forever home! #SecondChanceGlobal #AdoptDontShop`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Meet ${dog.name}`,
          text: shareText,
          url: url,
        });
        logDogShared(dog.id, dog.name, "web_share");
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
        logDogShared(dog.id, dog.name, "link_copy");
      }
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const handleStartChallenge = () => {
    if (!dog) return;

    logChallengeConversion(dog.id, "view_details");
    router.push("/challenge");
  };

  const handleContactShelter = () => {
    if (!dog) return;

    logChallengeConversion(dog.id, "adopt_inquiry");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#ff6b5a]" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!dog) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Dog Not Found</h1>
          <p className="mb-6 text-gray-600">
            We couldn&apos;t find information about this rescue dog.
          </p>
          <button
            onClick={() => router.push("/")}
            className="rounded-full bg-[#ff6b5a] px-6 py-3 font-semibold text-white hover:bg-[#ff5544]"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Challenge Badge */}
      {fromChallenge && (
        <motion.div
          className="border-b border-[#ffe8e0] bg-[#fff9f3] px-4 py-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="container mx-auto flex max-w-4xl items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-[#ff6b5a]" />
            <span className="font-medium text-gray-900">
              You found me through the challenge! Thank you for helping spread the word! 🎉
            </span>
          </div>
        </motion.div>
      )}

      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Image Gallery */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-gray-100 md:aspect-video">
            <Image
              src={dog.images[currentImageIndex] || dog.images[0] || ""}
              alt={dog.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </div>

          {/* Image Thumbnails */}
          {dog.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {dog.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg ${
                    index === currentImageIndex ? "ring-2 ring-[#ff6b5a]" : ""
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${dog.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Dog Info */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Header */}
          <div className="mb-6">
            <h1 className="mb-2 text-4xl font-bold text-gray-900">{dog.name}</h1>
            <div className="flex flex-wrap gap-4 text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {getAgeDisplay(dog.age)}
              </span>
              <span>•</span>
              <span className="capitalize">{dog.gender}</span>
              {dog.breed && (
                <>
                  <span>•</span>
                  <span>{dog.breed}</span>
                </>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#ff6b5a]" />
              <span className="font-semibold text-gray-900">Location</span>
            </div>
            <p className="text-gray-700">
              {dog.location.city}, {dog.location.country}
            </p>
          </div>

          {/* Shelter Info */}
          <div className="mb-6 rounded-lg bg-[#fff9f3] p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Current Shelter</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Heart className="mt-1 h-5 w-5 flex-shrink-0 text-[#ff6b5a]" />
                <div>
                  <p className="font-medium text-gray-900">{dog.shelter.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 flex-shrink-0 text-gray-600" />
                <a
                  href={`tel:${dog.shelter.contact}`}
                  onClick={handleContactShelter}
                  className="font-medium text-[#ff6b5a] hover:underline"
                >
                  {dog.shelter.contact}
                </a>
              </div>
              {dog.shelter.email && (
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 flex-shrink-0 text-gray-600" />
                  <a
                    href={`mailto:${dog.shelter.email}`}
                    onClick={handleContactShelter}
                    className="font-medium text-[#ff6b5a] hover:underline"
                  >
                    {dog.shelter.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#ff6b5a] px-6 py-4 text-base font-semibold text-white transition-all hover:bg-[#ff5544] hover:shadow-lg"
          >
            <Share2 className="h-5 w-5" />
            <span>Share {dog.name}&apos;s Profile</span>
          </button>

          {/* Create Challenge Button */}
          <button
            onClick={handleStartChallenge}
            className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#ff6b5a] bg-white px-6 py-4 text-base font-semibold text-[#ff6b5a] transition-all hover:bg-[#fff9f3]"
          >
            <Sparkles className="h-5 w-5" />
            <span>Create a Challenge with {dog.name}</span>
          </button>
        </motion.div>

        {/* Added Date */}
        {dog.createdAt && (
          <motion.div
            className="mt-6 text-center text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Listed on {new Date(dog.createdAt).toLocaleDateString()}
          </motion.div>
        )}
      </div>
    </div>
  );
}
