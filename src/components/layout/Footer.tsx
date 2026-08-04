import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ComponentType } from "react";
import {
  ArrowUpRight,
  Clock3,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitter,
  Youtube,
} from "lucide-react";

import type {
  FooterNavigationSection,
  SiteFooterData,
  SiteFooterNavigationItem,
  SiteFooterSocialLink,
} from "@/lib/types/site-footer";

import "./footer.css";

type FooterProps = {
  data: SiteFooterData;
};

type IconComponent = ComponentType<{
  size?: number | string;
  strokeWidth?: number | string;
}>;

const socialIcons: Record<string, IconComponent> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  twitter: Twitter,
  x: Twitter,
  globe: Globe,
  website: Globe,
  mail: Mail,
  email: Mail,
};

function isExternalLink(href: string): boolean {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

function FooterLink({
  href,
  label,
  openInNewTab = false,
  className,
}: {
  href: string;
  label: string;
  openInNewTab?: boolean;
  className?: string;
}) {
  if (isExternalLink(href)) {
    return (
      <a
        href={href}
        className={className}
        target={openInNewTab ? "_blank" : undefined}
        rel={
          openInNewTab
            ? "noopener noreferrer"
            : undefined
        }
      >
        {label}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      target={openInNewTab ? "_blank" : undefined}
      rel={
        openInNewTab
          ? "noopener noreferrer"
          : undefined
      }
    >
      {label}
    </Link>
  );
}

function getNavigationBySection(
  navigation: SiteFooterNavigationItem[],
  section: FooterNavigationSection,
): SiteFooterNavigationItem[] {
  return navigation
    .filter(
      (item) =>
        item.section_name === section &&
        item.is_active &&
        item.is_published,
    )
    .sort(
      (first, second) =>
        first.display_order -
        second.display_order,
    );
}

function SocialIcon({
  link,
  size,
}: {
  link: SiteFooterSocialLink;
  size: number;
}) {
  const normalizedIconName =
    link.icon_name.trim().toLowerCase();

  const normalizedPlatform =
    link.platform.trim().toLowerCase();

  const Icon =
    socialIcons[normalizedIconName] ||
    socialIcons[normalizedPlatform] ||
    Globe;

  return (
    <a
      href={link.url}
      aria-label={link.label}
      title={link.label}
      target={
        link.open_in_new_tab
          ? "_blank"
          : undefined
      }
      rel={
        link.open_in_new_tab
          ? "noopener noreferrer"
          : undefined
      }
      className="footerSocialLink"
    >
      <Icon size={size} />
    </a>
  );
}

export default function Footer({
  data,
}: FooterProps) {
  const settings = data?.settings ?? null;
  const contact = data?.contact ?? null;

  if (
    !settings ||
    !settings.is_active ||
    !settings.is_published
  ) {
    return null;
  }

  const quickLinks = getNavigationBySection(
    data.navigation,
    "quick_links",
  );

  const legalLinks = getNavigationBySection(
    data.navigation,
    "legal",
  );

  const resourceLinks = getNavigationBySection(
    data.navigation,
    "resources",
  );

  const supportLinks = getNavigationBySection(
    data.navigation,
    "support",
  );

  const socialLinks = data.socialLinks
    .filter(
      (link) =>
        link.is_active &&
        link.is_published,
    )
    .sort(
      (first, second) =>
        first.display_order -
        second.display_order,
    );

  const serviceLinks = data.services.slice(
    0,
    Math.max(1, settings.services_limit),
  );

  const visibleContact =
    contact &&
    contact.is_active &&
    contact.is_published
      ? contact
      : null;

  const footerStyle = {
    "--footer-background":
      settings.background_color,

    "--footer-gradient": `linear-gradient(${settings.gradient_direction}, ${settings.gradient_start_color}, ${settings.gradient_end_color})`,

    "--footer-background-image":
      settings.background_image_url
        ? `url("${settings.background_image_url}")`
        : "none",

    "--footer-overlay":
      settings.background_overlay_color,

    "--footer-heading-color":
      settings.heading_color,

    "--footer-heading-size": `${settings.heading_font_size}px`,

    "--footer-heading-weight":
      settings.heading_font_weight,

    "--footer-heading-spacing": `${settings.heading_letter_spacing}px`,

    "--footer-text-color":
      settings.text_color,

    "--footer-text-size": `${settings.text_font_size}px`,

    "--footer-text-weight":
      settings.text_font_weight,

    "--footer-line-height":
      settings.text_line_height,

    "--footer-link-color":
      settings.link_color,

    "--footer-link-hover":
      settings.link_hover_color,

    "--footer-link-size": `${settings.link_font_size}px`,

    "--footer-link-weight":
      settings.link_font_weight,

    "--footer-content-width": `${settings.content_max_width}px`,

    "--footer-columns":
      settings.column_count,

    "--footer-column-gap": `${settings.column_gap}px`,

    "--footer-row-gap": `${settings.row_gap}px`,

    "--footer-padding-top": `${settings.padding_top}px`,

    "--footer-padding-bottom": `${settings.padding_bottom}px`,

    "--footer-padding-left": `${settings.padding_left}px`,

    "--footer-padding-right": `${settings.padding_right}px`,

    "--footer-top-border-color":
      settings.top_border_color,

    "--footer-top-border-width":
      settings.show_top_border
        ? `${settings.top_border_width}px`
        : "0px",

    "--footer-divider-color":
      settings.divider_color,

    "--footer-copyright-color":
      settings.copyright_color,

    "--footer-copyright-size": `${settings.copyright_font_size}px`,

    "--footer-copyright-align":
      settings.copyright_alignment,

    "--footer-bottom-padding-top": `${settings.bottom_bar_padding_top}px`,

    "--footer-bottom-padding-bottom": `${settings.bottom_bar_padding_bottom}px`,

    "--footer-social-size": `${settings.social_icon_size}px`,

    "--footer-social-color":
      settings.social_icon_color,

    "--footer-social-hover-color":
      settings.social_icon_hover_color,

    "--footer-social-background":
      settings.social_icon_background_color,

    "--footer-social-hover-background":
      settings.social_icon_hover_background_color,

    "--footer-social-radius": `${settings.social_icon_radius}px`,

    "--footer-mobile-columns":
      settings.mobile_column_count,

    "--footer-mobile-breakpoint": `${settings.mobile_breakpoint}px`,
    "--footer-heading-bottom-spacing":
`${settings.heading_bottom_spacing}px`,

"--footer-links-gap":
`${settings.links_spacing}px`,
  } as CSSProperties;

  const backgroundClass =
    settings.background_type === "gradient"
      ? "footerBackgroundGradient"
      : settings.background_type === "image"
        ? "footerBackgroundImage"
        : "footerBackgroundSolid";

  return (
    <footer
      className={`siteFooter ${backgroundClass}`}
      style={footerStyle}
    >
      {settings.background_type === "image" ? (
        <div
          className="footerBackgroundOverlay"
          aria-hidden="true"
        />
      ) : null}

      <div className="footerContent">
        <div className="footerGrid">
          <div className="footerBrand">
            {settings.show_logo &&
            settings.logo_url ? (
              <Link
                href="/"
                className="footerLogoLink"
                aria-label={`${settings.company_name} home`}
              >
                <Image
                  src={settings.logo_url}
                  alt={settings.logo_alt}
                  width={settings.logo_width}
                  height={settings.logo_height}
                  className="footerLogo"
                />
              </Link>
            ) : (
              <Link
                href="/"
                className="footerCompanyName"
              >
                {settings.company_name}
              </Link>
            )}

            {settings.show_description &&
            settings.company_description ? (
              <p className="footerDescription">
                {settings.company_description}
              </p>
            ) : null}

            {settings.show_social_icons &&
            socialLinks.length > 0 ? (
              <div className="footerSocialSection">
                {settings.social_heading ? (
                  <h3 className="footerHeading">
                    {settings.social_heading}
                  </h3>
                ) : null}

                <div className="footerSocialLinks">
                  {socialLinks.map((link) => (
                    <SocialIcon
                      key={link.id}
                      link={link}
                      size={
                        settings.social_icon_size
                      }
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {settings.show_quick_links &&
          quickLinks.length > 0 ? (
            <div className="footerColumn">
              <h3 className="footerHeading">
                {settings.quick_links_heading}
              </h3>

              <nav className="footerLinks">
                {quickLinks.map((item) => (
                  <FooterLink
                    key={item.id}
                    href={item.href}
                    label={item.label}
                    openInNewTab={
                      item.open_in_new_tab
                    }
                  />
                ))}
              </nav>
            </div>
          ) : null}

          {settings.show_services &&
          serviceLinks.length > 0 ? (
            <div className="footerColumn">
              <h3 className="footerHeading">
                {settings.services_heading}
              </h3>

              <nav className="footerLinks">
                {serviceLinks.map((service) => (
                  <FooterLink
                    key={service.id}
                    href={service.href}
                    label={service.title}
                  />
                ))}

                {settings.services_show_view_all &&
                settings.services_view_all_text &&
                settings.services_view_all_link ? (
                  <FooterLink
                    href={
                      settings.services_view_all_link
                    }
                    label={
                      settings.services_view_all_text
                    }
                    className="footerViewAllLink"
                  />
                ) : null}
              </nav>
            </div>
          ) : null}

          {settings.show_legal_links &&
          legalLinks.length > 0 ? (
            <div className="footerColumn">
              <h3 className="footerHeading">
                {settings.legal_links_heading}
              </h3>

              <nav className="footerLinks">
                {legalLinks.map((item) => (
                  <FooterLink
                    key={item.id}
                    href={item.href}
                    label={item.label}
                    openInNewTab={
                      item.open_in_new_tab
                    }
                  />
                ))}
              </nav>
            </div>
          ) : null}

          {resourceLinks.length > 0 ? (
            <div className="footerColumn">
              <h3 className="footerHeading">
                Resources
              </h3>

              <nav className="footerLinks">
                {resourceLinks.map((item) => (
                  <FooterLink
                    key={item.id}
                    href={item.href}
                    label={item.label}
                    openInNewTab={
                      item.open_in_new_tab
                    }
                  />
                ))}
              </nav>
            </div>
          ) : null}

          {supportLinks.length > 0 ? (
            <div className="footerColumn">
              <h3 className="footerHeading">
                Support
              </h3>

              <nav className="footerLinks">
                {supportLinks.map((item) => (
                  <FooterLink
                    key={item.id}
                    href={item.href}
                    label={item.label}
                    openInNewTab={
                      item.open_in_new_tab
                    }
                  />
                ))}
              </nav>
            </div>
          ) : null}

          {settings.show_contact &&
          visibleContact ? (
            <div className="footerColumn footerContactColumn">
              <h3 className="footerHeading">
                {settings.contact_heading}
              </h3>

              <div
                className="footerContactList"
                style={
                  {
                    "--footer-contact-icon":
                      visibleContact.icon_color,
                  } as CSSProperties
                }
              >
                {visibleContact.show_phone &&
                visibleContact.phone ? (
                  <a
                    href={
                      visibleContact.phone_link ||
                      undefined
                    }
                    className="footerContactItem"
                  >
                    <Phone size={16} />
                    <span>
                      {visibleContact.phone}
                    </span>
                  </a>
                ) : null}

                {visibleContact.show_email &&
                visibleContact.email ? (
                  <a
                    href={
                      visibleContact.email_link ||
                      undefined
                    }
                    className="footerContactItem"
                  >
                    <Mail size={16} />
                    <span>
                      {visibleContact.email}
                    </span>
                  </a>
                ) : null}

                {visibleContact.show_address &&
                visibleContact.address ? (
                  visibleContact.address_link ? (
                    <a
                      href={
                        visibleContact.address_link
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footerContactItem"
                    >
                      <MapPin size={16} />
                      <span>
                        {visibleContact.address}
                      </span>
                    </a>
                  ) : (
                    <div className="footerContactItem">
                      <MapPin size={16} />
                      <span>
                        {visibleContact.address}
                      </span>
                    </div>
                  )
                ) : null}

                {visibleContact.show_working_hours &&
                visibleContact.working_hours ? (
                  <div className="footerContactItem">
                    <Clock3 size={16} />
                    <span>
                      {
                        visibleContact.working_hours
                      }
                    </span>
                  </div>
                ) : null}

                {visibleContact.map_url ? (
                  <a
                    href={visibleContact.map_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footerMapLink"
                  >
                    View on map
                    <ArrowUpRight size={15} />
                  </a>
                ) : null}

                <Link
                  href="/contact"
                  className="footerEnquiryLink"
                >
                  Start an enquiry
                  <Send size={15} />
                </Link>
              </div>
            </div>
          ) : null}
        </div>

        {settings.show_copyright ? (
          <div className="footerBottom">
            <p>{settings.copyright_text}</p>

            {legalLinks.length > 0 ? (
              <nav
                className="footerBottomLinks"
                aria-label="Legal navigation"
              >
                {legalLinks.map((item) => (
                  <FooterLink
                    key={`bottom-${item.id}`}
                    href={item.href}
                    label={item.label}
                    openInNewTab={
                      item.open_in_new_tab
                    }
                  />
                ))}
              </nav>
            ) : null}
          </div>
        ) : null}
      </div>
    </footer>
  );
}