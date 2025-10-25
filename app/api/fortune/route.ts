import { NextResponse } from "next/server";
import crypto from "crypto";
import { dailyFortune } from "@/lib/fortune/generator";
import { cookies } from "next/headers";
import { getOrInitAnon } from "@/lib/ai/rate";

export const runtime = "nodejs";

const TOKEN_COOKIE = "scg_fortune_token";

type FTToken = { ver: number; day: string; used: number; anon: string };

function getDayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function b64url(input: Buffer | string) {
  const b = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return b.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function fromB64url(input: string) {
  const norm = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = norm.length % 4 === 0 ? "" : "====".slice(norm.length % 4);
  return Buffer.from(norm + pad, "base64");
}
function hmac(data: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(data).digest();
}
function sign(token: FTToken, secret: string) {
  const payload = JSON.stringify(token);
  const sig = b64url(hmac(payload, secret));
  const body = b64url(Buffer.from(payload));
  return `${body}.${sig}`;
}
function verify(raw: string, secret: string): FTToken | null {
  const [body, sig] = raw.split(".");
  if (!body || !sig) return null;
  const expected = b64url(hmac(fromB64url(body).toString(), secret));
  if (expected !== sig) return null;
  try {
    return JSON.parse(fromB64url(body).toString()) as FTToken;
  } catch {
    return null;
  }
}

async function readToken(secret: string): Promise<{ token: FTToken; creditsLeft: number }> {
  const jar = await cookies();
  const raw = jar.get(TOKEN_COOKIE)?.value || "";
  const anon = await getOrInitAnon();
  const today = getDayKey();
  let token = raw ? verify(raw, secret) : null;
  if (!token || token.day !== today || token.anon !== anon) token = { ver: 1, day: today, used: 0, anon };
  return { token, creditsLeft: Math.max(0, 3 - token.used) };
}
async function saveToken(secret: string, token: FTToken) {
  const jar = await cookies();
  const value = sign(token, secret);
  jar.set(TOKEN_COOKIE, value, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: true,
    maxAge: 60 * 60 * 24,
  });
}

export async function GET() {
  const secret = process.env.SCG_RATE_SECRET || "dev-secret";
  const { creditsLeft } = await readToken(secret);
  return NextResponse.json({ creditsLeft });
}

export async function POST() {
  const secret = process.env.SCG_RATE_SECRET || "dev-secret";
  const { token, creditsLeft } = await readToken(secret);
  if (creditsLeft <= 0) return NextResponse.json({ message: "Daily limit reached", creditsLeft: 0 }, { status: 429 });
  const fortune = dailyFortune({ anon: token.anon, day: token.day, attempt: token.used });
  const updated = { ...token, used: Math.min(3, token.used + 1) };
  await saveToken(secret, updated);
  return NextResponse.json({ fortune, creditsLeft: Math.max(0, 3 - updated.used) });
}

