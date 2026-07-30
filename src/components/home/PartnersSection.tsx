import { getHomepagePartnersData } from "@/lib/actions/homepage-partner";


import PartnerMarquee from "./PartnerMarquee";

export const dynamic = "force-dynamic";

export default async function PartnersSection() {
  const data =
    await getHomepagePartnersData();

  const { section, partners } = data;

  if (!section || !section.is_active) {
    return null;
  }

  const visiblePartners =
    partners
      .filter(
        (partner) =>
          partner.is_active &&
          partner.is_published &&
          partner.logo_url,
      )
      .sort(
        (firstPartner, secondPartner) =>
          firstPartner.display_order -
          secondPartner.display_order,
      );

  if (visiblePartners.length === 0) {
    return null;
  }

  return (
    <section
      className="overflow-hidden"
      style={{
        backgroundColor:
          section.background_color,
        paddingTop: `${section.padding_top}px`,
        paddingBottom: `${section.padding_bottom}px`,
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          {section.heading ? (
            <h2
              style={{
                color: section.heading_color,
                fontSize: `${section.heading_size}px`,
                fontWeight:
                  section.heading_weight,
                lineHeight: 1.15,
              }}
            >
              {section.heading}
            </h2>
          ) : null}

          {section.subheading ? (
            <p
              className="mt-4"
              style={{
                color:
                  section.subheading_color,
                fontSize: `${section.subheading_size}px`,
                lineHeight: 1.7,
              }}
            >
              {section.subheading}
            </p>
          ) : null}
        </div>
      </div>

      <PartnerMarquee
        partners={visiblePartners}
        autoplaySpeed={
          section.autoplay_speed
        }
      />
    </section>
  );
}