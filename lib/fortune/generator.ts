import crypto from "crypto";

const FORTUNES = [
  "Your kindness opens unexpected doors today.",
  "A small act of care will ripple far.",
  "Share your light — it returns multiplied.",
  "Today’s smile becomes tomorrow’s good news.",
  "Patience brings the result you hoped for.",
  "Someone needs exactly your words today.",
  "You’ll find joy in something simple.",
  "Courage grows when shared with friends.",
  "New paths appear when you take the first step.",
  "Gratitude turns enough into plenty.",
];

function hashToIndex(seed: string, mod: number) {
  const h = crypto.createHash("sha256").update(seed).digest();
  // Use first 4 bytes as unsigned int
  const num = h.readUInt32BE(0);
  return num % mod;
}

export function dailyFortune({ anon, day, attempt }: { anon: string; day: string; attempt: number }) {
  const idx = hashToIndex(`${anon}:${day}:${attempt}`, FORTUNES.length);
  return `Today’s Fortune: ${FORTUNES[idx]}`;
}

