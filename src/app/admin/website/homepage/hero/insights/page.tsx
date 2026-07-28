import type { Metadata } from "next";

import { getHeroInsights } from "@/lib/actions/hero-insight";
import { getHeroSlides } from "@/lib/actions/hero";
import "./insights.css";

import { HeroInsightsManager } from "./components/HeroInsightsManager";

export const metadata: Metadata = {
  title: "Hero Insights | Website CMS",
  description: "Manage homepage hero insight cards.",
};

export default async function HeroInsightsPage() {
  const [insights, heroSlides] = await Promise.all([
    getHeroInsights(),
    getHeroSlides(),
  ]);

  const totalInsights = insights.length;

  const visibleInsights = insights.filter(
    (insight) => insight.is_visible,
  ).length;

  const hiddenInsights = totalInsights - visibleInsights;

  return (
    <HeroInsightsManager
      insights={insights}
      heroSlides={heroSlides}
      statistics={{
        total: totalInsights,
        visible: visibleInsights,
        hidden: hiddenInsights,
      }}
    />
  );
}