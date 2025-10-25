import Link from "next/link";
import type { Metadata } from "next";

// Use loose typing for Next.js dynamic params to align with Next 15's PageProps
type Params = { params: any };

export const metadata: Metadata = {
  title: "SecondChance Global - Share",
};

export default async function ShareByInfoPage({ params }: Params) {
  const { info } = params;
  let decoded: any = null;
  try {
    const json = Buffer.from(info, "base64url").toString("utf8");
    decoded = JSON.parse(json);
  } catch {
    // ignore
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Shared Rescue Profile</h1>
        <Link href="/" className="rounded-full bg-[#ff6b5a] px-4 py-2 text-sm font-semibold text-white">
          Home
        </Link>
      </header>

      {decoded ? (
        <div className="space-y-3 rounded-xl border bg-white p-5 shadow">
          {decoded.name && <h2 className="text-2xl font-bold text-gray-900">{decoded.name}</h2>}
          {decoded.location && (
            <p className="text-gray-700">
              {decoded.location.city}, {decoded.location.country}
            </p>
          )}
          {decoded.shelter?.name && (
            <p className="text-sm text-gray-600">Shelter: {decoded.shelter.name}</p>
          )}
          {decoded.shelter?.contact && (
            <p className="text-sm text-gray-600">Contact: {decoded.shelter.contact}</p>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-8 text-center text-gray-600">
          Invalid or expired share information.
        </div>
      )}
    </div>
  );
}
