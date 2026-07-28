import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getHeroSlides } from "@/lib/actions/hero";
import { getHeroInsight } from "@/lib/actions/hero-insight";

// import { HeroInsightForm } from "../../../components/HeroInsightForm";
import { HeroInsightForm } from "../../components/HeroInsightForm";
import "../../insights.css";
export const metadata: Metadata = {
  title: "Edit Hero Insight | Website CMS",
  description: "Edit an existing homepage hero insight card.",
};

type EditHeroInsightPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditHeroInsightPage({
  params,
}: EditHeroInsightPageProps) {
  const { id } = await params;

  const [insight, heroSlides] = await Promise.all([
    getHeroInsight(id),
    getHeroSlides(),
  ]);

  if (!insight) {
    notFound();
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Edit Hero Insight</h1>

          <p>
            Update the selected hero insight and assign it to the correct
            hero slide.
          </p>
        </div>
      </div>

      <HeroInsightForm
        heroSlides={heroSlides}
        insight={insight}
      />
    </div>
  );
}