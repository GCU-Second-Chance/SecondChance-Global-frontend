import type { Metadata } from "next";
import { fetchDogById } from "@/lib/api/dogs";
import DogProfile from "@/components/share/DogProfile";

// Use loose typing for Next.js dynamic params to align with Next 15's PageProps
type Params = { params: any };

export const metadata: Metadata = {
  title: "SecondChance Global - Share",
};

export default async function ShareByIdPage({ params }: Params) {
  const { id } = params;
  let dog: any = null;
  try {
    // American dataset requires explicit country in path-based API
    dog = await fetchDogById(id, "American");
  } catch {
    // ignore and render fallback
  }

  return <DogProfile dog={dog} />;
}
