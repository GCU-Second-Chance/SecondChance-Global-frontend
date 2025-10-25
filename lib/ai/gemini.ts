const ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent";

type Mode = "enhance" | "cleanup" | "cartoon";

function buildPrompt(mode: Mode): string {
  switch (mode) {
    case "cleanup":
      return "Enhance this photo subtly: remove small artifacts and noise while preserving natural colors and details. Avoid over-sharpening or changes to identity.";
    case "cartoon":
      return "Create a friendly, lightly stylized illustration version of this photo. Keep subject recognizable, soft edges, warm palette, minimal background distractions.";
    default:
      return "Denoise and improve sharpness and color balance of this photo. Preserve fur/texture and overall natural look. Avoid extreme changes.";
  }
}

export async function geminiTransformImage({
  apiKey,
  imageBase64,
  mime,
  mode,
}: {
  apiKey: string;
  imageBase64: string;
  mime: string;
  mode: Mode;
}): Promise<{ base64: string; mime: string }> {
  const prompt = buildPrompt(mode);
  const body = {
    contents: [
      {
        parts: [{ text: prompt }, { inlineData: { mimeType: mime, data: imageBase64 } }],
      },
    ],
  } as const;

  const res = await fetch(`${ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Gemini request failed: ${res.status} ${text}`);
  }
  const json = (await res.json()) as any;
  const data = json?.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData)?.inlineData
    ?.data;
  const outMime =
    json?.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData)?.inlineData?.mimeType ||
    mime;
  if (!data) throw new Error("Gemini response missing image data");
  return { base64: data, mime: outMime };
}
