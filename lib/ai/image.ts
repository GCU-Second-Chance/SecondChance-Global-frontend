export async function blobUrlToBase64(url: string): Promise<{ base64: string; mime: string }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch image blob");
  const blob = await res.blob();
  const mime = blob.type || "image/png";
  const arrayBuffer = await blob.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  return { base64, mime };
}

export function dataUrlToBase64(dataUrl: string): { base64: string; mime: string } {
  const m = dataUrl.match(/^data:(.*?);base64,(.*)$/);
  if (!m) throw new Error("Invalid data URL");
  const [, mime, data] = m;
  return { base64: data as string, mime: mime as string };
}

export function toDataUrl(mime: string, base64: string) {
  return `data:${mime};base64,${base64}`;
}
