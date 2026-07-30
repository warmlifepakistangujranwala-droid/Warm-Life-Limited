import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import CertificationForm from "../CertificationForm";

export default async function NewCertificationPage() {
  const supabase = await createClient();
  const { data: section } = await supabase
    .from("homepage_certifications_section")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (!section) notFound();

  return <CertificationForm mode="create" sectionId={section.id} />;
}
