import LogoMarquee from "@/components/home/LogoMarquee";
import type { HomepageCertificationsData } from "@/lib/types/homepage-certification";

type CertificationsSectionProps = {
  data: HomepageCertificationsData;
};

export default function CertificationsSection({
  data,
}: CertificationsSectionProps) {
  const section = data.section;
  const items = data.certifications;

  if (!section?.is_active || items.length === 0) return null;

  return (
    <section
      className="brandBand certificationBand dynamicCertificationBand"
      style={{
        backgroundColor: section.background_color,
        paddingTop: `${section.padding_top}px`,
        paddingBottom: `${section.padding_bottom}px`,
      }}
    >
      <div className="shell">
        <div className="certificationHeading">
          <h2
            style={{
              color: section.heading_color,
              fontSize: `${section.heading_size}px`,
              fontWeight: section.heading_weight,
            }}
          >
            {section.heading}
          </h2>
        </div>

        <LogoMarquee items={items} speed={section.autoplay_speed} />
      </div>
    </section>
  );
}
