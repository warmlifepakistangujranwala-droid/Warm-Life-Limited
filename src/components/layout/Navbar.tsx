"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import {
  type CSSProperties,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  NavigationItem,
  SiteHeaderData,
  SiteHeaderSettings,
} from "@/lib/types/site-header";

type NavbarProps = {
  data: SiteHeaderData;
  overlay?: boolean;
};

function isExternalLink(href: string): boolean {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

function getHeaderShadow(
  shadow: SiteHeaderSettings["shadow_style"],
): string {
  switch (shadow) {
    case "soft":
      return "0 18px 55px rgba(15, 23, 42, 0.10)";
    case "medium":
      return "0 22px 65px rgba(15, 23, 42, 0.14)";
    case "strong":
      return "0 28px 80px rgba(15, 23, 42, 0.18)";
    default:
      return "none";
  }
}

function isCurrentLink(
  pathname: string,
  href: string,
): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function DynamicLink({
  item,
  className,
  style,
  onClick,
}: {
  item: NavigationItem;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}) {
  if (isExternalLink(item.href)) {
    return (
      <a
        href={item.href}
        target={item.open_in_new_tab ? "_blank" : undefined}
        rel={item.open_in_new_tab ? "noopener noreferrer" : undefined}
        className={className}
        style={style}
        onClick={onClick}
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      target={item.open_in_new_tab ? "_blank" : undefined}
      rel={item.open_in_new_tab ? "noopener noreferrer" : undefined}
      className={className}
      style={style}
      onClick={onClick}
    >
      {item.label}
    </Link>
  );
}

export default function Navbar({ data, overlay = false }: NavbarProps) {
  const pathname = usePathname();
  const settings = data?.settings ?? null;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const desktopNavigation = useMemo(
    () =>
      (data?.navigation ?? [])
        .filter(
          (item) =>
            item.is_active &&
            item.is_published &&
            item.show_on_desktop &&
            !item.parent_id,
        )
        .sort((a, b) => a.display_order - b.display_order),
    [data?.navigation],
  );

  const mobileNavigation = useMemo(
    () =>
      (data?.navigation ?? [])
        .filter(
          (item) =>
            item.is_active &&
            item.is_published &&
            item.show_on_mobile &&
            !item.parent_id,
        )
        .sort((a, b) => a.display_order - b.display_order),
    [data?.navigation],
  );

  useEffect(() => {
    if (!settings?.sticky_enabled) {
      setIsScrolled(false);
      return;
    }

    function handleScroll(): void {
      setIsScrolled(
        window.scrollY > Math.max(10, settings?.sticky_offset ?? 0),
      );
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [settings?.sticky_enabled, settings?.sticky_offset]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  if (!settings || !settings.is_active || !settings.is_published) {
    return null;
  }

  const closeMobileMenu = (): void => setMobileMenuOpen(false);
  const desktopLogo = settings.logo_url;
  const mobileLogo = settings.mobile_logo_url || settings.logo_url;

  const containerBackground = isScrolled
    ? settings.header_scrolled_background_color
    : settings.header_background_type === "blur"
      ? "rgba(255,255,255,0.86)"
      : settings.header_background_type === "transparent" && overlay
        ? "rgba(255,255,255,0.90)"
        : settings.header_background_color;

  const ctaStyle = {
    "--cta-text": settings.cta_text_color,
    "--cta-background": settings.cta_background_color,
    "--cta-border": settings.cta_border_color,
    "--cta-hover-text": settings.cta_hover_text_color,
    "--cta-hover-background": settings.cta_hover_background_color,
    "--cta-hover-border": settings.cta_hover_border_color,
    borderRadius: `${settings.cta_radius}px`,
    paddingLeft: `${settings.cta_padding_x}px`,
    paddingRight: `${settings.cta_padding_x}px`,
    paddingTop: `${settings.cta_padding_y}px`,
    paddingBottom: `${settings.cta_padding_y}px`,
    fontSize: `${settings.cta_font_size}px`,
    fontWeight: settings.cta_font_weight,
  } as CSSProperties;

  return (
    <>
      <header
        className="cmsHeader"
        style={{
          position: overlay
  ? "absolute"
  : settings.sticky_enabled
    ? "sticky"
    : "relative",
          top: overlay
  ? "0"
  : settings.sticky_enabled
    ? `${settings.sticky_offset}px`
    : undefined,
          zIndex: 1000,
        }}
      >
        {settings.announcement_enabled && settings.announcement_text ? (
          <div
            className="announcementBar"
            style={{
              minHeight: `${settings.announcement_height}px`,
              color: settings.announcement_text_color,
              backgroundColor: settings.announcement_background_color,
              fontSize: `${settings.announcement_font_size}px`,
              fontWeight: settings.announcement_font_weight,
            }}
          >
            {settings.announcement_link ? (
              isExternalLink(settings.announcement_link) ? (
                <a
                  href={settings.announcement_link}
                  target={
                    settings.announcement_open_in_new_tab
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    settings.announcement_open_in_new_tab
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  {settings.announcement_text}
                </a>
              ) : (
                <Link
                  href={settings.announcement_link}
                  target={
                    settings.announcement_open_in_new_tab
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    settings.announcement_open_in_new_tab
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  {settings.announcement_text}
                </Link>
              )
            ) : (
              <span>{settings.announcement_text}</span>
            )}
          </div>
        ) : null}

        <div
          className="navbarInner"
          style={{
            minHeight: `${settings.header_height}px`,
            maxWidth: `${settings.content_max_width}px`,
            paddingLeft: `${settings.header_padding_x}px`,
            paddingRight: `${settings.header_padding_x}px`,
            background: containerBackground,
            border: settings.show_border
              ? `${settings.border_width}px solid ${settings.border_color}`
              : "1px solid rgba(23,37,29,0.08)",
            boxShadow: getHeaderShadow(settings.shadow_style),
            backdropFilter:
              settings.header_background_type === "blur" || isScrolled
                ? "blur(16px)"
                : undefined,
            WebkitBackdropFilter:
              settings.header_background_type === "blur" || isScrolled
                ? "blur(16px)"
                : undefined,
          }}
        >
          <Link
            className="navbarBrand"
            href="/"
            aria-label={settings.logo_alt || "Warm Life home"}
            onClick={closeMobileMenu}
          >
            {desktopLogo ? (
              <Image
                src={desktopLogo}
                alt={settings.logo_alt}
                width={settings.logo_width}
                height={settings.logo_height}
                priority
                className="desktopLogo"
                style={{
                  width: `${settings.logo_width}px`,
                  maxHeight: `${settings.logo_height}px`,
                }}
              />
            ) : (
              <span
                className="brandFallback"
                style={{ color: settings.header_text_color }}
              >
                Warm Life
              </span>
            )}

            {mobileLogo ? (
              <Image
                src={mobileLogo}
                alt={settings.mobile_logo_alt}
                width={settings.mobile_logo_width}
                height={settings.mobile_logo_height}
                priority
                className="mobileLogo"
                style={{
                  width: `${settings.mobile_logo_width}px`,
                  maxHeight: `${settings.mobile_logo_height}px`,
                }}
              />
            ) : null}
          </Link>

          <nav
            className="desktopNavigation"
            aria-label="Primary navigation"
            style={{ gap: `${settings.nav_item_gap}px` }}
          >
            {desktopNavigation.map((item) => {
              const active = isCurrentLink(pathname, item.href);

              return (
                <DynamicLink
                  key={item.id}
                  item={item}
                  className={`desktopNavLink ${
                    active ? "desktopNavLinkActive" : ""
                  }`}
                  style={
                    {
                      "--nav-colour": active
                        ? settings.header_active_color
                        : settings.header_text_color,
                      "--nav-hover-colour": settings.header_hover_color,
                      fontSize: `${settings.nav_font_size}px`,
                      fontWeight: settings.nav_font_weight,
                      letterSpacing: `${settings.nav_letter_spacing}px`,
                    } as CSSProperties
                  }
                />
              );
            })}
          </nav>

          <div className="navbarActions">
            {settings.show_cta && settings.cta_text && settings.cta_link ? (
              isExternalLink(settings.cta_link) ? (
                <a
                  href={settings.cta_link}
                  target={settings.cta_open_in_new_tab ? "_blank" : undefined}
                  rel={
                    settings.cta_open_in_new_tab
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="navbarCta"
                  style={ctaStyle}
                >
                  <span>{settings.cta_text}</span>
                  <ArrowRight size={16} />
                </a>
              ) : (
                <Link
                  href={settings.cta_link}
                  target={settings.cta_open_in_new_tab ? "_blank" : undefined}
                  rel={
                    settings.cta_open_in_new_tab
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="navbarCta"
                  style={ctaStyle}
                  onClick={closeMobileMenu}
                >
                  <span>{settings.cta_text}</span>
                  <ArrowRight size={16} />
                </Link>
              )
            ) : null}

            <button
              type="button"
              className="mobileMenuButton"
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((current) => !current)}
              style={{
                color: settings.hamburger_color,
                width: `${settings.hamburger_size + 20}px`,
                height: `${settings.hamburger_size + 20}px`,
              }}
            >
              {mobileMenuOpen ? (
                <X size={settings.hamburger_size} />
              ) : (
                <Menu size={settings.hamburger_size} />
              )}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`mobileMenuOverlay ${
          mobileMenuOpen ? "mobileMenuOverlayOpen" : ""
        }`}
        style={{ backgroundColor: settings.mobile_menu_overlay_color }}
        onClick={closeMobileMenu}
      />

      <aside
        className={`mobileMenuPanel ${
          mobileMenuOpen ? "mobileMenuPanelOpen" : ""
        }`}
        style={{
          width: `min(${settings.mobile_menu_width}px, 92vw)`,
          backgroundColor: settings.mobile_menu_background_color,
          padding: `${settings.mobile_menu_padding}px`,
        }}
      >
        <div className="mobileMenuHeader">
          <Link href="/" onClick={closeMobileMenu}>
            {mobileLogo ? (
              <Image
                src={mobileLogo}
                alt={settings.mobile_logo_alt}
                width={settings.mobile_logo_width}
                height={settings.mobile_logo_height}
                className="mobilePanelLogo"
                style={{
                  width: `${settings.mobile_logo_width}px`,
                  maxHeight: `${settings.mobile_logo_height}px`,
                }}
              />
            ) : (
              <span
                className="brandFallback"
                style={{ color: settings.mobile_menu_text_color }}
              >
                Warm Life
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close navigation menu"
            style={{ color: settings.hamburger_color }}
          >
            <X size={settings.hamburger_size} />
          </button>
        </div>

        <nav
          className="mobileNavigation"
          aria-label="Mobile navigation"
          style={{ gap: `${settings.mobile_menu_item_gap}px` }}
        >
          {mobileNavigation.map((item) => {
            const active = isCurrentLink(pathname, item.href);

            return (
              <DynamicLink
                key={item.id}
                item={item}
                onClick={closeMobileMenu}
                className="mobileNavLink"
                style={
                  {
                    "--mobile-nav-colour": active
                      ? settings.header_active_color
                      : settings.mobile_menu_text_color,
                    "--mobile-nav-hover": settings.mobile_menu_hover_color,
                    fontSize: `${settings.nav_font_size}px`,
                    fontWeight: settings.nav_font_weight,
                    letterSpacing: `${settings.nav_letter_spacing}px`,
                  } as CSSProperties
                }
              />
            );
          })}

          {settings.show_cta && settings.cta_text && settings.cta_link ? (
            isExternalLink(settings.cta_link) ? (
              <a
                href={settings.cta_link}
                target={settings.cta_open_in_new_tab ? "_blank" : undefined}
                rel={
                  settings.cta_open_in_new_tab
                    ? "noopener noreferrer"
                    : undefined
                }
                className="mobileNavbarCta navbarCta"
                style={ctaStyle}
              >
                {settings.cta_text}
                <ArrowRight size={16} />
              </a>
            ) : (
              <Link
                href={settings.cta_link}
                target={settings.cta_open_in_new_tab ? "_blank" : undefined}
                rel={
                  settings.cta_open_in_new_tab
                    ? "noopener noreferrer"
                    : undefined
                }
                className="mobileNavbarCta navbarCta"
                style={ctaStyle}
                onClick={closeMobileMenu}
              >
                {settings.cta_text}
                <ArrowRight size={16} />
              </Link>
            )
          ) : null}
        </nav>
      </aside>

      <style jsx global>{`
        .cmsHeader {
          left: 0;
          right: 0;
          width: 100%;
          padding: 18px 16px 0;
          background: transparent;
        }

        .announcementBar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: min(1280px, calc(100% - 32px));
          margin: 0 auto 10px;
          padding: 6px 20px;
          border-radius: 999px;
          text-align: center;
          line-height: 1.4;
        }

        .announcementBar a {
          color: inherit;
          text-decoration: none;
        }

        .announcementBar a:hover {
          text-decoration: underline;
        }

        .navbarInner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: min(1280px, calc(100% - 16px));
          margin: 0 auto;
          gap: 26px;
          border-radius: 999px;
          overflow: hidden;
          transition:
            background-color 260ms ease,
            box-shadow 260ms ease,
            border-color 260ms ease,
            transform 260ms ease;
        }

        .navbarBrand {
          display: inline-flex;
          align-items: center;
          width: 180px;
          flex-shrink: 0;
          text-decoration: none;
        }

        .desktopLogo,
        .mobileLogo,
        .mobilePanelLogo {
          display: block;
          height: auto;
          object-fit: contain;
        }

        .desktopLogo {
          max-width: 150px;
        }

        .mobileLogo {
          display: none;
        }

        .brandFallback {
          font-size: 22px;
          font-weight: 800;
          white-space: nowrap;
        }

        .desktopNavigation {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          margin: 0 auto;
        }

        .desktopNavLink {
          position: relative;
          color: var(--nav-colour);
          text-decoration: none;
          white-space: nowrap;
          transition: color 200ms ease;
        }

        .desktopNavLink::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -8px;
          height: 2px;
          border-radius: 999px;
          background: var(--nav-hover-colour);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 200ms ease;
        }

        .desktopNavLink:hover {
          color: var(--nav-hover-colour);
        }

        .desktopNavLink:hover::after,
        .desktopNavLinkActive::after {
          transform: scaleX(1);
        }

        .navbarActions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .navbarCta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1px solid var(--cta-border);
          color: var(--cta-text);
          background: var(--cta-background);
          text-decoration: none;
          white-space: nowrap;
          transition:
            color 220ms ease,
            background-color 220ms ease,
            border-color 220ms ease,
            transform 220ms ease,
            box-shadow 220ms ease;
        }

        .navbarCta:hover {
          color: var(--cta-hover-text);
          background: var(--cta-hover-background);
          border-color: var(--cta-hover-border);
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.14);
        }

        .mobileMenuButton {
          display: none;
          align-items: center;
          justify-content: center;
          padding: 0;
          border: 0;
          border-radius: 12px;
          background: transparent;
          cursor: pointer;
        }

        .mobileMenuOverlay {
          position: fixed;
          inset: 0;
          z-index: 1090;
          visibility: hidden;
          opacity: 0;
          transition: opacity 250ms ease, visibility 250ms ease;
        }

        .mobileMenuOverlayOpen {
          visibility: visible;
          opacity: 1;
        }

        .mobileMenuPanel {
          position: fixed;
          z-index: 1100;
          top: 0;
          right: 0;
          bottom: 0;
          overflow-y: auto;
          transform: translateX(105%);
          box-shadow: -20px 0 50px rgba(15, 23, 42, 0.18);
          transition: transform 280ms ease;
        }

        .mobileMenuPanelOpen {
          transform: translateX(0);
        }

        .mobileMenuHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(15, 23, 42, 0.1);
        }

        .mobileMenuHeader button {
          display: grid;
          flex-shrink: 0;
          place-items: center;
          padding: 7px;
          border: 0;
          background: transparent;
          cursor: pointer;
        }

        .mobileNavigation {
          display: flex;
          flex-direction: column;
          padding-top: 28px;
        }

        .mobileNavLink {
          color: var(--mobile-nav-colour);
          text-decoration: none;
          transition: color 200ms ease, transform 200ms ease;
        }

        .mobileNavLink:hover {
          color: var(--mobile-nav-hover);
          transform: translateX(5px);
        }

        .mobileNavbarCta {
          width: fit-content;
          margin-top: 10px;
        }

        @media (max-width: ${settings.mobile_breakpoint}px) {
          .cmsHeader {
            padding: 10px 8px 0;
          }

          .navbarInner {
            width: calc(100% - 8px);
            min-height: 72px !important;
            padding-left: 18px !important;
            padding-right: 14px !important;
            border-radius: 24px;
            gap: 14px;
          }

          .desktopNavigation,
          .navbarActions > .navbarCta {
            display: none;
          }

          .mobileMenuButton {
            display: inline-flex;
          }

          .desktopLogo {
            display: none;
          }

          .mobileLogo {
            display: block;
          }

          .navbarBrand {
            width: auto;
          }
        }

        @media (min-width: ${settings.mobile_breakpoint + 1}px) {
          .mobileMenuOverlay,
          .mobileMenuPanel {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .navbarInner,
          .desktopNavLink,
          .desktopNavLink::after,
          .navbarCta,
          .mobileMenuOverlay,
          .mobileMenuPanel,
          .mobileNavLink {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}
