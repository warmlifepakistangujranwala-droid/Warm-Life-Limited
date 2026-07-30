import { getHeroSlides } from "@/lib/actions/hero";
import { getHeroInsights } from "@/lib/actions/hero-insight";
import { getHomepageServicesData } from "@/lib/actions/homepage-service";
import { getHomepageCertificationsData } from "@/lib/actions/homepage-certification";
import { getHomepagePartnersData } from "@/lib/actions/homepage-partner";
import { getHomepageLocalAuthoritiesData } from "@/lib/actions/homepage-local-authority";

import HomePageClient from "@/components/home/HomePageClient";

export default async function HomePage() {
  const [
    heroSlides,
    heroInsights,
    homepageServices,
    homepageCertifications,
    homepagePartners,
    homepageLocalAuthorities,
  ] = await Promise.all([
    getHeroSlides(),
    getHeroInsights(),
    getHomepageServicesData(),
    getHomepageCertificationsData(),
    getHomepagePartnersData(),
    getHomepageLocalAuthoritiesData(),
  ]);

  return (
    <HomePageClient
      heroSlides={heroSlides}
      heroInsights={heroInsights}
      homepageServices={homepageServices}
      homepageCertifications={homepageCertifications}
      homepagePartners={homepagePartners}
      homepageLocalAuthorities={homepageLocalAuthorities}
    />
  );
}