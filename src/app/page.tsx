import { getHeroSlides } from "@/lib/actions/hero";
import { getHeroInsights } from "@/lib/actions/hero-insight";
import { getHomepageServicesData } from "@/lib/actions/homepage-service";

import HomePageClient from "@/components/home/HomePageClient";

export default async function HomePage() {
  const [
    heroSlides,
    heroInsights,
    homepageServices,
  ] = await Promise.all([
    getHeroSlides(),
    getHeroInsights(),
    getHomepageServicesData(),
  ]);

  return (
    <HomePageClient
      heroSlides={heroSlides}
      heroInsights={heroInsights}
      homepageServices={homepageServices}
    />
  );
}