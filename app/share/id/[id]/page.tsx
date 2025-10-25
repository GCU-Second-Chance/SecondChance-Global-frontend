import Link from "next/link";
import type { Metadata } from "next";
import { fetchDogById } from "@/lib/api/dogs";

// Use loose typing for Next.js dynamic params to align with Next 15's PageProps
type Params = { params: any };

export const metadata: Metadata = {
  title: "SecondChance Global - Share",
};

export default async function ShareByIdPage({ params }: Params) {
  const { id } = params;
  let dog: any = null;
  try {
    dog = await fetchDogById(id);
  } catch {
    // ignore and render fallback
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Shared Rescue Profile</h1>
        <Link href="/" className="rounded-full bg-[#ff6b5a] px-4 py-2 text-sm font-semibold text-white">
          Home
        </Link>
      </header>

      {dog ? (
        <div className="space-y-3 rounded-xl border bg-white p-5 shadow">
          <h2 className="text-2xl font-bold text-gray-900">{dog.name}</h2>
          <p className="text-gray-700">
            {dog.location?.city}, {dog.location?.country}
          </p>
          {dog.shelter?.name && (
            <p className="text-sm text-gray-600">Shelter: {dog.shelter.name}</p>
          )}
          {dog.shelter?.contact && (
            <p className="text-sm text-gray-600">Contact: {dog.shelter.contact}</p>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-8 text-center text-gray-600">
          Unable to load dog information for id {id}.
        </div>
      )}
    </div>
  );
}
