import { notFound } from "next/navigation";

// import EditStatisticForm from "../../../../EditStatisticForm";
import EditStatisticForm from "../../../EditStatisticForm";


import { getHomepageDeliveryData } from "@/lib/actions/homepage-delivery";

export const dynamic = "force-dynamic";

type EditStatisticPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditStatisticPage({
  params,
}: EditStatisticPageProps) {
  const { id } = await params;

  const data = await getHomepageDeliveryData();

  const statistic =
    data.statistics.find(
      (item) => item.id === id,
    ) ?? null;

  if (!data.section || !statistic) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-950">
          Edit Delivery Statistic
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Update the value, title, description, colours,
          icon and display settings.
        </p>
      </header>

      <EditStatisticForm
        statistic={statistic}
      />
    </main>
  );
}