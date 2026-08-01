import { notFound } from "next/navigation";


import EditGroupForm from "../../../EditGroupForm";

import { getHomepageHowWeWorkData } from "@/lib/actions/homepage-how-we-work";

export const dynamic = "force-dynamic";

type EditHowWeWorkGroupPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditHowWeWorkGroupPage({
  params,
}: EditHowWeWorkGroupPageProps) {
  const { id } = await params;

  const data =
    await getHomepageHowWeWorkData();

  const section = data.section;

  const group =
    data.groups.find(
      (item) => item.id === id,
    ) ?? null;

  if (!section || !group) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 p-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-950">
          Edit Process Group
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Update the group content, icon or image,
          background, typography, layout, highlight
          and visibility.
        </p>
      </header>

      <EditGroupForm
        group={group}
      />
    </main>
  );
}