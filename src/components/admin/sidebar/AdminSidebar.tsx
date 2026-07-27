/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : AdminSidebar.tsx
 * Module  : Admin CMS Navigation
 *
 * Purpose :
 * Displays the complete navigation for the Warm Life CMS.
 *
 * The navigation provides access to website content, homepage
 * sections, AI chatbot, leads, media, SEO, appearance and
 * system settings.
 *
 * Version : v0.4.0
 * ============================================================
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import LogoutButton from "@/components/admin/forms/LogoutButton";

import "./admin-sidebar.css";

/**
 * Props required by the responsive administration sidebar.
 */
interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Represents one CMS navigation link.
 */
interface NavigationItem {
  href: string;
  label: string;
  icon: string;
}

/**
 * Represents a group of related CMS navigation links.
 */
interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

/**
 * Complete Warm Life CMS navigation structure.
 */
const navigationGroups: NavigationGroup[] = [
  {
    title: "Overview",
    items: [
      {
        href: "/admin/dashboard",
        label: "Dashboard",
        icon: "⌂",
      },
    ],
  },
  {
    title: "Website Management",
    items: [
      {
        href: "/admin/website/homepage",
        label: "Homepage",
        icon: "▤",
      },
      {
        href: "/admin/website/about",
        label: "About Page",
        icon: "◉",
      },
      {
        href: "/admin/website/contact",
        label: "Contact Page",
        icon: "✉",
      },
      {
        href: "/admin/website/faq",
        label: "FAQ Page",
        icon: "?",
      },
      {
        href: "/admin/website/header",
        label: "Header",
        icon: "▔",
      },
      {
        href: "/admin/website/footer",
        label: "Footer",
        icon: "▁",
      },
    ],
  },
  {
    title: "Content",
    items: [
      {
        href: "/admin/services",
        label: "Services",
        icon: "◇",
      },
      {
        href: "/admin/blogs",
        label: "Blogs",
        icon: "✎",
      },
      {
        href: "/admin/case-studies",
        label: "Case Studies",
        icon: "▣",
      },
      {
        href: "/admin/testimonials",
        label: "Testimonials",
        icon: "★",
      },
      {
        href: "/admin/faqs",
        label: "FAQs",
        icon: "?",
      },
    ],
  },
  {
    title: "Media",
    items: [
      {
        href: "/admin/media",
        label: "Media Library",
        icon: "▧",
      },
      {
        href: "/admin/media/images",
        label: "Images",
        icon: "▨",
      },
      {
        href: "/admin/media/videos",
        label: "Videos",
        icon: "▶",
      },
    ],
  },
  {
    title: "Customers",
    items: [
      {
        href: "/admin/leads",
        label: "Leads & Enquiries",
        icon: "◎",
      },
      {
        href: "/admin/leads/contact-messages",
        label: "Contact Messages",
        icon: "✉",
      },
      {
        href: "/admin/leads/chatbot",
        label: "Chatbot Leads",
        icon: "◌",
      },
    ],
  },
  {
    title: "AI Tools",
    items: [
      {
        href: "/admin/chatbot",
        label: "AI Chatbot",
        icon: "✦",
      },
      {
        href: "/admin/chatbot/knowledge",
        label: "AI Knowledge",
        icon: "◫",
      },
      {
        href: "/admin/chatbot/questions",
        label: "Suggested Questions",
        icon: "?",
      },
      {
        href: "/admin/chatbot/conversations",
        label: "Conversations",
        icon: "◌",
      },
      {
        href: "/admin/chatbot/settings",
        label: "AI Settings",
        icon: "⚙",
      },
    ],
  },
  {
    title: "Marketing",
    items: [
      {
        href: "/admin/seo",
        label: "SEO Manager",
        icon: "⌕",
      },
      {
        href: "/admin/seo/metadata",
        label: "Page Metadata",
        icon: "▤",
      },
      {
        href: "/admin/seo/social",
        label: "Social Sharing",
        icon: "↗",
      },
      {
        href: "/admin/seo/analytics",
        label: "Analytics",
        icon: "⌁",
      },
    ],
  },
  {
    title: "Appearance",
    items: [
      {
        href: "/admin/appearance",
        label: "Theme Settings",
        icon: "◐",
      },
      {
        href: "/admin/appearance/colours",
        label: "Colours",
        icon: "●",
      },
      {
        href: "/admin/appearance/typography",
        label: "Typography",
        icon: "A",
      },
      {
        href: "/admin/appearance/buttons",
        label: "Buttons",
        icon: "▭",
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        href: "/admin/settings",
        label: "Website Settings",
        icon: "⚙",
      },
      {
        href: "/admin/settings/users",
        label: "Admin Users",
        icon: "♙",
      },
      {
        href: "/admin/settings/activity",
        label: "Activity Log",
        icon: "↻",
      },
    ],
  },
];

/**
 * Determines whether a navigation link represents the current route.
 */
function isNavigationItemActive(pathname: string, href: string) {
  if (href === "/admin/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Renders the complete desktop and mobile CMS navigation.
 */
export default function AdminSidebar({
  isOpen,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`admin-sidebar ${
        isOpen ? "admin-sidebar--open" : ""
      }`}
    >
      <div className="admin-sidebar__brand">
        <Image
          alt="Warm Life Ltd"
          className="admin-sidebar__logo"
          height={70}
          priority
          src="/images/warm-life-logo.png"
          width={70}
        />

        <div className="admin-sidebar__brand-copy">
          <strong>Warm Life</strong>
          <span>CMS Administration</span>
        </div>

        <button
          aria-label="Close navigation"
          className="admin-sidebar__close"
          onClick={onClose}
          type="button"
        >
          ×
        </button>
      </div>

      <nav
        aria-label="Administration navigation"
        className="admin-sidebar__navigation"
      >
        {navigationGroups.map((group) => (
          <section
            className="admin-sidebar__group"
            key={group.title}
          >
            <p className="admin-sidebar__section-label">
              {group.title}
            </p>

            <div className="admin-sidebar__nav">
              {group.items.map((item) => {
                const isActive = isNavigationItemActive(
                  pathname,
                  item.href
                );

                return (
                  <Link
                    className={`admin-sidebar__link ${
                      isActive
                        ? "admin-sidebar__link--active"
                        : ""
                    }`}
                    href={item.href}
                    key={item.href}
                    onClick={onClose}
                  >
                    <span
                      aria-hidden="true"
                      className="admin-sidebar__icon"
                    >
                      {item.icon}
                    </span>

                    <span className="admin-sidebar__link-label">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </nav>

      <div className="admin-sidebar__footer">
        <div className="admin-sidebar__status">
          <span className="admin-sidebar__status-indicator" />

          <div>
            <strong>Website online</strong>
            <span>All systems operational</span>
          </div>
        </div>

        <LogoutButton />
      </div>
    </aside>
  );
}