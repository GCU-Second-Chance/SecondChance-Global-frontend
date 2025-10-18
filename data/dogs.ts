/**
 * Mock Dog Data
 * Sample rescue dogs for development and testing
 */

import type { Dog } from "@/stores/types";

export const mockDogs: Dog[] = [
  {
    id: "dog_001",
    images: [
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",
    ],
    name: "Happy",
    age: 3,
    gender: "male",
    breed: "Golden Retriever Mix",
    location: {
      country: "South Korea",
      city: "Seoul",
    },
    shelter: {
      name: "Seoul Animal Shelter",
      contact: "010-1234-5678",
      email: "contact@seoulanimal.kr",
    },
    createdAt: "2024-12-01",
  },
  {
    id: "dog_002",
    images: [
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80",
      "https://images.unsplash.com/photo-1583511666407-5f06533f2113?w=800&q=80",
    ],
    name: "Luna",
    age: 2,
    gender: "female",
    breed: "Husky Mix",
    location: {
      country: "South Korea",
      city: "Busan",
    },
    shelter: {
      name: "Busan Hope Shelter",
      contact: "010-2345-6789",
      email: "hope@busanshelter.kr",
    },
    createdAt: "2024-12-05",
  },
  {
    id: "dog_003",
    images: [
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80",
    ],
    name: "Max",
    age: 5,
    gender: "male",
    breed: "Labrador Mix",
    location: {
      country: "South Korea",
      city: "Incheon",
    },
    shelter: {
      name: "Incheon Animal Care",
      contact: "010-3456-7890",
    },
    createdAt: "2024-11-20",
  },
  {
    id: "dog_004",
    images: [
      "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&q=80",
      "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&q=80",
    ],
    name: "Bella",
    age: 1,
    gender: "female",
    breed: "Beagle Mix",
    location: {
      country: "South Korea",
      city: "Daegu",
    },
    shelter: {
      name: "Daegu Pet Rescue",
      contact: "010-4567-8901",
      email: "rescue@daegupet.kr",
    },
    createdAt: "2024-12-10",
  },
  {
    id: "dog_005",
    images: [
      "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=800&q=80",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80",
    ],
    name: "Charlie",
    age: 4,
    gender: "male",
    breed: "Shiba Inu Mix",
    location: {
      country: "South Korea",
      city: "Gwangju",
    },
    shelter: {
      name: "Gwangju Animal Friends",
      contact: "010-5678-9012",
      email: "friends@gwangjuanimals.kr",
    },
    createdAt: "2024-11-25",
  },
  {
    id: "dog_006",
    images: [
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800&q=80",
      "https://images.unsplash.com/photo-1534361960057-19889db9621e?w=800&q=80",
    ],
    name: "Daisy",
    age: 3,
    gender: "female",
    breed: "Poodle Mix",
    location: {
      country: "South Korea",
      city: "Ulsan",
    },
    shelter: {
      name: "Ulsan Care Center",
      contact: "010-6789-0123",
    },
    createdAt: "2024-12-03",
  },
];

/**
 * Get a random dog from the mock data
 */
export function getRandomDog(): Dog {
  const randomIndex = Math.floor(Math.random() * mockDogs.length);
  return mockDogs[randomIndex]!;
}

/**
 * Get dog by ID
 */
export function getDogById(id: string): Dog | undefined {
  return mockDogs.find((dog) => dog.id === id);
}
