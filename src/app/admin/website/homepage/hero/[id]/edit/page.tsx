import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getHeroSlide } from "@/lib/actions/hero";
import HeroEditForm from "./HeroEditForm";
import "../../new/hero-form.css";

export const metadata: Metadata = {
  title: "Edit Hero Slide | Website CMS",
  description: "Edit an existing homepage hero slide.",
};

type EditHeroSlidePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditHeroSlidePage({
  params,
}: EditHeroSlidePageProps) {
  const { id } = await params;

  const heroSlide = await getHeroSlide(id);

  if (!heroSlide) {
    notFound();
  }

  return (
  <div className="heroFormPage">
    <header className="heroFormPage__header">
      <div>
        <div className="heroFormPage__breadcrumb">
          <span>Homepage</span>
          <span>/</span>
          <span>Hero</span>
          <span>/</span>
          <strong>Edit</strong>
        </div>

        <div className="heroFormPage__titleRow">
          <div>
            <h1>Edit Hero Slide</h1>
            <p>
              Update the selected hero video, content and display
              settings.
            </p>
          </div>
        </div>
      </div>
    </header>

    <HeroEditForm heroSlide={heroSlide} />
  </div>
);
}