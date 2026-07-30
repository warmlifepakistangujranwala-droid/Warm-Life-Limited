import { notFound } from "next/navigation";

// import LocalAuthorityForm from "../../../LocalAuthorityForm";
import LocalAuthorityForm from "../../LocalAuthorityForm";

import { getHomepageLocalAuthoritiesData } from "@/lib/actions/homepage-local-authority";

export const dynamic = "force-dynamic";

type EditLocalAuthorityPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditLocalAuthorityPage({
  params,
}: EditLocalAuthorityPageProps) {
  const { id } = await params;

  const data =
    await getHomepageLocalAuthoritiesData();

  const section = data.section;

  const authority =
    data.localAuthorities.find(
      (item) => item.id === id,
    );

  if (!section || !authority) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-950">
          Edit Local Authority
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Update the logo, link, display
          order and publishing settings for{" "}
          {authority.name}.
        </p>
      </header>

      <LocalAuthorityForm
        mode="edit"
        section={section}
        authority={authority}
      />
    </main>
  );
}