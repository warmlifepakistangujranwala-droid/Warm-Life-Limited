import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getHomepageService } from "@/lib/actions/homepage-service";
import ServiceForm from "../../_components/ServiceForm";

interface EditHomepageServicePageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: "Edit Homepage Service",
  description: "Edit homepage service content.",
};

export default async function EditHomepageServicePage({
  params,
}: EditHomepageServicePageProps) {
  const { id } = await params;

  const service = await getHomepageService(id);

  if (!service) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ServiceForm
        mode="edit"
        service={service}
      />
    </main>
  );
}