import { notFound } from "next/navigation";

import PartnerForm from "../../PartnerForm";

import { getHomepagePartnersData } from "@/lib/actions/homepage-partner";

export const dynamic = "force-dynamic";

type EditPartnerPageProps = {
  params: {
    id: string;
  };
};

export default async function EditPartnerPage({
  params,
}: EditPartnerPageProps) {
  const data =
    await getHomepagePartnersData();

  const partner =
    data.partners.find(
      (item) => item.id === params.id,
    ) ?? null;

  if (!partner) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl p-8">
      <PartnerForm
        mode="edit"
        sectionId={partner.section_id}
        partner={partner}
      />
    </main>
  );
}