import type { Metadata } from "next";

import ServiceForm from "../_components/ServiceForm";

export const metadata: Metadata = {
  title: "Create Homepage Service",
  description: "Create a new service for the homepage services section.",
};

export default function NewHomepageServicePage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ServiceForm mode="create" />
    </main>
  );
}