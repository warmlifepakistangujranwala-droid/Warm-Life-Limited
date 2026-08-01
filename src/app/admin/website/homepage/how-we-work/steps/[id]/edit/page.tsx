import { notFound } from "next/navigation";

import EditStepForm from "../../../EditStepForm";
import { getHomepageHowWeWorkData } from "@/lib/actions/homepage-how-we-work";

export const dynamic = "force-dynamic";

type EditHowWeWorkStepPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditHowWeWorkStepPage({
  params,
}: EditHowWeWorkStepPageProps) {
  const { id } = await params;

  const data = await getHomepageHowWeWorkData();

  const step =
    data.groups
      .flatMap((group) => group.steps)
      .find((item) => item.id === id) ?? null;

  if (!step) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-950">
          Edit Process Step
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Update the step content, media, colours,
          styling, button, order and visibility.
        </p>
      </header>

      <EditStepForm step={step} />
    </main>
  );
}