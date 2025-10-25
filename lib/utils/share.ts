import type { Dog } from "@/stores/types";

export function buildShareText(dog: Dog): string {
  const name = dog.name || "this rescue";
  const location = `${dog.location.city}, ${dog.location.country}`;
  const shelterRaw = dog.shelter?.name?.trim();
  const contactRaw = dog.shelter?.contact?.trim();

  const lines: string[] = [];
  lines.push(`🐾 ${name} find their second chance at a forever home!`);
  lines.push(`📍 ${location}`);

  if (shelterRaw && !/^unknown(?:\s+shelter)?$/i.test(shelterRaw)) {
    lines.push(`🏠 ${shelterRaw}`);
  }

  if (contactRaw && !/^contact unavailable$/i.test(contactRaw)) {
    lines.push(`☎️ ${contactRaw}`);
  }

  lines.push("#SecondChanceGlobal #AdoptDontShop");
  return lines.join("\n");
}

// Base info only (no hashtags) — used when inserting Fortune-of-the-day
export function buildShareTextBase(dog: Dog): string {
  const name = dog.name || "this rescue";
  const location = `${dog.location.city}, ${dog.location.country}`;
  const shelterRaw = dog.shelter?.name?.trim();
  const contactRaw = dog.shelter?.contact?.trim();

  const lines: string[] = [];
  lines.push(`🐾 ${name} find their second chance at a forever home!`);
  lines.push(`📍 ${location}`);

  if (shelterRaw && !/^unknown(?:\s+shelter)?$/i.test(shelterRaw)) {
    lines.push(`🏠 ${shelterRaw}`);
  }

  if (contactRaw && !/^contact unavailable$/i.test(contactRaw)) {
    lines.push(`☎️ ${contactRaw}`);
  }

  return lines.join("\n");
}

export function buildKoreanInfoPayload(dog: Dog): string {
  // Encode rich info as base64 JSON for the /share/info route
  const info = {
    id: dog.id,
    name: dog.name,
    images: dog.images,
    location: dog.location,
    shelter: dog.shelter,
    breed: dog.breed,
    gender: dog.gender,
    age: dog.age,
    createdAt: dog.createdAt,
    origin: dog.origin,
  };
  const json = JSON.stringify(info);
  // base64url encode to be URL path safe
  const b64 =
    typeof window === "undefined"
      ? Buffer.from(json).toString("base64url")
      : btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  return b64;
}

export function buildShareUrl(dog: Dog, originBase?: string): string {
  const base = originBase || (typeof window !== "undefined" ? window.location.origin : "");

  // American (id only), Korean (rich info), default to id if unknown
  const isAmerican =
    dog.origin === "American" || /united states|usa|america/i.test(dog.location.country);
  const isKorean =
    dog.origin === "Korean" || /korea|korean|대한민국|한국/i.test(dog.location.country);

  if (isKorean) {
    const payload = buildKoreanInfoPayload(dog);
    return `${base}/share/info/${payload}`;
  }

  if (isAmerican) {
    return `${base}/share/id/${encodeURIComponent(dog.id)}`;
  }

  // Fallback: id
  return `${base}/share/id/${encodeURIComponent(dog.id)}`;
}
