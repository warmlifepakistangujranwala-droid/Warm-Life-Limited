import LocalAuthoritiesMarquee from "./LocalAuthoritiesMarquee";

import type {
  HomepageLocalAuthoritiesData,
} from "@/lib/types/homepage-local-authority";

type LocalAuthoritySectionProps = {
  data: HomepageLocalAuthoritiesData;
};

export default function LocalAuthoritySection({
  data,
}: LocalAuthoritySectionProps) {
  const section = data.section;

  if (!section || !section.is_active) {
    return null;
  }

  const activeAuthorities =
    data.localAuthorities.filter(
      (authority) =>
        authority.is_active &&
        authority.is_published,
    );

  if (activeAuthorities.length === 0) {
    return null;
  }

  return (
    <LocalAuthoritiesMarquee
      data={{
        section,
        localAuthorities:
          activeAuthorities,
      }}
    />
  );
}