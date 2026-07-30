import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import CertificationForm from "../../CertificationForm";

export default async function EditCertificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: certification }, { data: section }] = await Promise.all([
    supabase
      .from("certifications")
      .select("*")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("homepage_certifications_section")
      .select("id")
      .limit(1)
      .maybeSingle(),
  ]);

  if (!certification || !section) {
    notFound();
  }

  return (
    <CertificationForm
      mode="edit"
      sectionId={section.id}
      certification={certification}
    />
  );
}
