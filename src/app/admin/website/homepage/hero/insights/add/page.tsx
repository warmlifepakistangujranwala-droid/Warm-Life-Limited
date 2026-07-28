import type { Metadata } from "next";

import { getHeroSlides } from "@/lib/actions/hero";

import { HeroInsightForm } from "../components/HeroInsightForm";
import "../insights.css";

export const metadata: Metadata = {
  title: "Add Hero Insight | Website CMS",
  description: "Create a new hero insight.",
};

export default async function AddHeroInsightPage() {
  const heroSlides = await getHeroSlides();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Add Hero Insight</h1>
          <p>
            Create a new insight card for a hero slide.
          </p>
        </div>
      </div>

      <HeroInsightForm heroSlides={heroSlides} />
    </div>
  );
}