import type { Metadata } from "next";
import DogProfile from "@/components/share/DogProfile";

type Params = { params: { info: string } };

export const metadata: Metadata = {
  title: "SecondChance Global - Shared Info",
};

function decodeBase64Url(input: string): string {
  try {
    // Node 18+ supports base64url
    return Buffer.from(input, "base64url").toString("utf8");
  } catch {
    // Fallback: normalize to base64 and decode
    const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
    const pad = normalized.length % 4 === 0 ? "" : "====".slice(normalized.length % 4);
    return Buffer.from(normalized + pad, "base64").toString("utf8");
  }
}

export default async function ShareByInfoPage({ params }: Params) {
  const { info } = params;

  let data: any = null;
  try {
    const json = decodeBase64Url(info);
    data = JSON.parse(json);
  } catch {
    data = null;
  }

  return <DogProfile dog={data} />;
}
