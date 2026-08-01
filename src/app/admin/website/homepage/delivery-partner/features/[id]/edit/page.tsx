import { notFound } from "next/navigation";


import EditFeatureForm from "../../../EditFeatureForm";

import { getHomepageDeliveryData } from "@/lib/actions/homepage-delivery";

export const dynamic = "force-dynamic";

type EditFeaturePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditFeaturePage({
  params,
}: EditFeaturePageProps) {
  const { id } = await params;

  const data =
    await getHomepageDeliveryData();

  const feature =
    data.features.find(
      (item) => item.id === id,
    ) ?? null;

  if (!data.section || !feature) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-950">
          Edit Delivery Benefit
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Update the benefit title, description, icon,
          display order and visibility settings.
        </p>
      </header>

      <EditFeatureForm
        feature={feature}
      />
    </main>
  );
}