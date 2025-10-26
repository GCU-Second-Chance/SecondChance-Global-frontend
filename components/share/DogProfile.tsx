import React from "react";
import Link from "next/link";
import DogGallery from "@/components/share/DogGallery";
import { englishAge, englishLocation } from "@/lib/utils/englishize";

type LocationLike = { country?: string; city?: string } | undefined;
type ShelterLike = { name?: string; contact?: string; email?: string } | undefined;

export interface DogLike {
  id?: string;
  name?: string;
  images?: string[];
  age?: number | string;
  gender?: string;
  breed?: string;
  location?: LocationLike;
  shelter?: ShelterLike;
}

interface DogProfileProps {
  dog: DogLike | null;
  showHome?: boolean;
}

export default function DogProfile({ dog, showHome = true }: DogProfileProps) {
  const title = dog?.name || "Rescue Dog";
  const city = dog?.location?.city || "Unknown";
  const country = dog?.location?.country || "Unknown";
  const province = (dog?.location as any)?.province as string | undefined;
  const shelterName = dog?.shelter?.name;
  const contact = dog?.shelter?.contact;
  const email = dog?.shelter?.email;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Shared Rescue Profile</h1>
        {showHome && (
          <Link href="/" className="rounded-full bg-[#ff6b5a] px-4 py-2 text-sm font-semibold text-white">
            Home
          </Link>
        )}
      </header>

      {dog ? (
        <div className="space-y-6 rounded-xl border bg-white p-5 shadow">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-700">
              {englishLocation(city, country, province)}
            </p>
          </div>

          {dog.images && dog.images.length > 0 && <DogGallery images={dog.images} />}

          <div className="grid gap-3 sm:grid-cols-2">
            {dog.breed && (
              <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Breed:</span> {dog.breed}
              </div>
            )}
            {typeof dog.gender !== "undefined" && dog.gender && (
              <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Gender:</span> {dog.gender}
              </div>
            )}
            {typeof dog.age !== "undefined" && (
              <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Age:</span> {typeof dog.age === "number" ? englishAge(dog.age) : englishAge(String(dog.age ?? ""))}
              </div>
            )}
          </div>

          {(shelterName || contact || email) && (
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Shelter</p>
              {shelterName && <p className="text-sm font-medium text-gray-900">{shelterName}</p>}
              {contact && <p className="text-xs text-gray-700">{contact}</p>}
              {email && <p className="text-xs text-gray-700">{email}</p>}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-8 text-center text-gray-600">
          Unable to load dog information.
        </div>
      )}
    </div>
  );
}
