import Link from "next/link";
import { Inbox } from "lucide-react";
import {
  getContactPageSettings,
  getContactPageDetails,
  getContactEnquiryTypes,
  getContactSocialLinks,
} from "@/lib/actions/contact-page";
import ContactSettingsForm from "./ContactSettingsForm";
import ContactDetailsManager from "./managers/ContactDetailsManager";
import EnquiryTypesManager from "./managers/EnquiryTypesManager";
import SocialLinksManager from "./managers/SocialLinksManager";
import "./contact-admin.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ContactAdminPage() {
  const [
    settings,
    details,
    enquiryTypes,
    socialLinks,
  ] = await Promise.all([
    getContactPageSettings(),
    getContactPageDetails(),
    getContactEnquiryTypes(),
    getContactSocialLinks(),
  ]);

  if (!settings) {
    return (
      <main className="contactAdminPage">
        <div className="contactAdminPage__missing">
          Contact Page settings not found. Run the Contact Page SQL migration first.
        </div>
      </main>
    );
  }

  return (
    <main className="contactAdminPage">
      <header className="contactAdminHeader">
        <div>
          <span>Website CMS</span>
          <h1>Contact Page</h1>
          <p>Manage hero, contact content, enquiry form, map, CTA and SEO.</p>
        </div>

        <div className="contactAdminHeader__actions">
          <Link href="/admin/website/contact/submissions">
            <Inbox size={16} />
            Form Submissions
          </Link>

          <Link href="/contact" target="_blank" rel="noreferrer">
            View Contact Page
          </Link>
        </div>
      </header>

      <ContactSettingsForm initialSettings={settings} />

      <ContactDetailsManager
        contactPageId={settings.id}
        initialItems={details}
      />

      <EnquiryTypesManager
        contactPageId={settings.id}
        initialItems={enquiryTypes}
      />

      <SocialLinksManager
        contactPageId={settings.id}
        initialItems={socialLinks}
      />
    </main>
  );
}