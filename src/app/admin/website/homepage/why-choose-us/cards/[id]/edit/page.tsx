import { notFound } from "next/navigation";

// import EditCardForm from "../../../../EditCardForm";
import EditCardForm from "../../../EditCardForm";


import { getHomepageWhyChooseUsData } from "@/lib/actions/homepage-why-choose-us";

export const dynamic = "force-dynamic";

type EditWhyChooseUsCardPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditWhyChooseUsCardPage({
  params,
}: EditWhyChooseUsCardPageProps) {
  const { id } = await params;

  const data =
    await getHomepageWhyChooseUsData();

  const section = data.section;

  const card =
    data.cards.find(
      (item) => item.id === id,
    ) ?? null;

  if (!section || !card) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-950">
          Edit Why Choose Us Card
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Update the card content, icon or image,
          colours, sizing, layout and visibility.
        </p>
      </header>

      <EditCardForm
        card={card}
      />
    </main>
  );
}