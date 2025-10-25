import { NextResponse } from "next/server";
import { blobUrlToBase64, dataUrlToBase64, toDataUrl } from "@/lib/ai/image";
import { geminiTransformImage } from "@/lib/ai/gemini";
import { getOrInitAnon, readRate, saveRate } from "@/lib/ai/rate";

export const runtime = "nodejs";

type Body = {
  image: string; // data URL or blob: URL
  mode?: "enhance" | "cleanup" | "cartoon";
};

function ensureEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

export async function GET() {
  // read credits without consuming
  const secret = process.env.SCG_RATE_SECRET || "dev-secret";
  const { creditsLeft } = await readRate(secret);
  return NextResponse.json({ creditsLeft });
}

export async function POST(req: Request) {
  const secret = process.env.SCG_RATE_SECRET || "dev-secret";
  await getOrInitAnon(); // ensure anon cookie exists
  const { token, creditsLeft } = await readRate(secret);
  if (creditsLeft <= 0) {
    return NextResponse.json(
      { message: "Daily AI limit reached", creditsLeft: 0 },
      { status: 429 }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  if (!body?.image) {
    return NextResponse.json({ message: "Missing image" }, { status: 400 });
  }

  let base64: string;
  let mime: string;
  try {
    if (body.image.startsWith("data:")) {
      const v = dataUrlToBase64(body.image);
      base64 = v.base64;
      mime = v.mime;
    } else if (body.image.startsWith("blob:")) {
      return NextResponse.json(
        { message: "blob: URLs are not supported. Send data URL." },
        { status: 400 }
      );
    } else {
      return NextResponse.json({ message: "Unsupported image URL" }, { status: 400 });
    }
  } catch (e: any) {
    return NextResponse.json(
      { message: `Image parse failed: ${e?.message || e}` },
      { status: 400 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { message: "GEMINI_API_KEY is not configured", creditsLeft },
      { status: 501 }
    );
  }

  try {
    const out = await geminiTransformImage({
      apiKey,
      imageBase64: base64,
      mime,
      mode: body.mode || "enhance",
    });
    const dataUrl = toDataUrl(out.mime, out.base64);

    // consume one credit
    const updated = { ...token, used: Math.min(2, token.used + 1) };
    await saveRate(secret, updated);

    const resp = NextResponse.json({ image: dataUrl, creditsLeft: Math.max(0, 2 - updated.used) });
    return resp;
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || "AI transform failed" }, { status: 500 });
  }
}
