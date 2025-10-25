import { cookies } from "next/headers";
import crypto from "crypto";

const TOKEN_COOKIE = "scg_ai_token";
const ANON_COOKIE = "scg_anon";

export type RateToken = {
  ver: number;
  day: string; // YYYYMMDD
  used: number; // 0..2
  anon: string;
};

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

export function signToken(token: RateToken, secret: string) {
  const payload = JSON.stringify(token);
  const sig = b64url(hmac(payload, secret));
  const body = b64url(Buffer.from(payload));
  return `${body}.${sig}`;
}

export function verifyToken(raw: string, secret: string): RateToken | null {
  const [body, sig] = raw.split(".");
  if (!body || !sig) return null;
  const expected = b64url(hmac(fromB64url(body).toString(), secret));
  if (expected !== sig) return null;
  try {
    const parsed = JSON.parse(fromB64url(body).toString()) as RateToken;
    return parsed;
  } catch {
    return null;
  }
}

function uuidv4() {
  return crypto.randomUUID();
}

export async function getOrInitAnon() {
  const jar = await cookies();
  let anon = jar.get(ANON_COOKIE)?.value;
  if (!anon) {
    anon = uuidv4();
    jar.set(ANON_COOKIE, anon, {
      httpOnly: false,
      path: "/",
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return anon;
}

export async function readRate(secret: string): Promise<{ token: RateToken; creditsLeft: number }> {
  const jar = await cookies();
  const raw = jar.get(TOKEN_COOKIE)?.value || "";
  const anon = await getOrInitAnon();
  const today = getDayKey();

  let token: RateToken | null = null;
  if (raw) token = verifyToken(raw, secret);

  if (!token || token.day !== today || token.anon !== anon) {
    token = { ver: 1, day: today, used: 0, anon };
  }
  const creditsLeft = Math.max(0, 2 - token.used);
  return { token, creditsLeft };
}

export async function saveRate(secret: string, token: RateToken) {
  const jar = await cookies();
  const value = signToken(token, secret);
  jar.set(TOKEN_COOKIE, value, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: true,
    // expire roughly at next day start
    maxAge: 60 * 60 * 24,
  });
}
