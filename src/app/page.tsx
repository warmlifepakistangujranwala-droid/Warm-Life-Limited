import { getHeroSlides } from "@/lib/actions/hero";
import { getHeroInsights } from "@/lib/actions/hero-insight";

import HomePageClient from "@/components/home/HomePageClient";

export default async function HomePage() {
  const [heroSlides, heroInsights] = await Promise.all([
    getHeroSlides(),
    getHeroInsights(),
  ]);

  return (
    <HomePageClient
      heroSlides={heroSlides}
      heroInsights={heroInsights}
    />
  );
}