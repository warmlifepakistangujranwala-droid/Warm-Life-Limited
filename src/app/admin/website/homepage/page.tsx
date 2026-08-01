import Link from "next/link";
import {
  ArrowRight,
  Award,
  BarChart3,
  Bot,
  Building2,
  CheckCircle2,
  Handshake,
  Home,
  LayoutTemplate,
  MessageSquareQuote,
  Play,
  Settings2,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import "./homepage.css";

type HomepageManagerItem = {
  title: string;
  description: string;
  count: number | null;
  countLabel: string;
  href: string;
  addLabel: string;
  addHref: string;
  status?: string;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
};

async function getTableCount(
  tableName:
    | "hero_slides"
    | "services"
    | "delivery_statistics"
    | "certifications"
    | "partners"
    | "homepage_why_choose_us_cards"
    | "work_process_groups"
    | "testimonials"
    | "local_authorities",
) {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from(tableName)
    .select("*", {
      count: "exact",
      head: true,
    });

  if (error) {
    console.error(`Could not count ${tableName}:`, error.message);
    return 0;
  }

  return count ?? 0;
}

async function getHomepageStatus() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("homepage_settings")
    .select("is_published")
    .eq("page_slug", "home")
    .maybeSingle();

  if (error) {
    console.error("Could not load homepage status:", error.message);
    return "Draft";
  }

  return data?.is_published ? "Published" : "Draft";
}

async function getHomepageData() {
  const [
    homepageStatus,
    heroCount,
    servicesCount,
    statisticsCount,
    certificationsCount,
    partnersCount,
    whyChooseUsCount,
    workProcessCount,
    testimonialsCount,
    localAuthoritiesCount,
  ] = await Promise.all([
    getHomepageStatus(),
    getTableCount("hero_slides"),
    getTableCount("services"),
    getTableCount("delivery_statistics"),
    getTableCount("certifications"),
    getTableCount("partners"),
    getTableCount("homepage_why_choose_us_cards"),
    getTableCount("work_process_groups"),
    getTableCount("testimonials"),
    getTableCount("local_authorities"),
  ]);

  return {
    homepageStatus,
    heroCount,
    servicesCount,
    statisticsCount,
    certificationsCount,
    partnersCount,
    whyChooseUsCount,
    workProcessCount,
    testimonialsCount,
    localAuthoritiesCount,
  };
}

export default async function HomepageManagerPage() {
  const data = await getHomepageData();

  const managerItems: HomepageManagerItem[] = [
    {
      title: "Hero",
      description:
        "Manage hero videos, headings, descriptions, buttons and interactive insight cards.",
      count: data.heroCount,
      countLabel: data.heroCount === 1 ? "video" : "videos",
      href: "/admin/website/homepage/hero",
      addLabel: "Add Hero Video",
      addHref: "/admin/website/homepage/hero/new",
      status: data.heroCount > 0 ? "Configured" : "Needs content",
      icon: Play,
    },
    {
      title: "Services",
      description:
        "Add unlimited services and control the scroll-driven service journey.",
      count: data.servicesCount,
      countLabel: data.servicesCount === 1 ? "service" : "services",
      href: "/admin/website/homepage/services",
      addLabel: "Add Service",
      addHref: "/admin/website/homepage/services/new",
      status: data.servicesCount > 0 ? "Configured" : "Needs content",
      icon: Wrench,
    },
    {
      title: "Delivery Statistics",
      description:
        "Manage figures such as completed projects, technicians and delivered measures.",
      count: data.statisticsCount,
      countLabel: data.statisticsCount === 1 ? "statistic" : "statistics",
     href:"/admin/website/homepage/delivery-partner",
      addLabel: "Add Statistic",
      addHref: "/admin/website/homepage/delivery-partner#delivery-statistics",
      status: data.statisticsCount > 0 ? "Configured" : "Needs content",
      icon: BarChart3,
    },
    {
      title: "Certifications",
      description:
        "Upload and manage certification logos, names, links and display order.",
      count: data.certificationsCount,
      countLabel:
        data.certificationsCount === 1 ? "certificate" : "certificates",
      href: "/admin/website/homepage/certifications",
      addLabel: "Add Certificate",
      addHref: "/admin/website/homepage/certifications/new",
      status: data.certificationsCount > 0 ? "Configured" : "Needs content",
      icon: Award,
    },
    {
      title: "Partners",
      description:
        "Add unlimited partner logos and manage their links and display order.",
      count: data.partnersCount,
      countLabel: data.partnersCount === 1 ? "partner" : "partners",
      href: "/admin/website/homepage/partners",
      addLabel: "Add Partner",
      addHref: "/admin/website/homepage/partners/new",
      status: data.partnersCount > 0 ? "Configured" : "Needs content",
      icon: Handshake,
    },
    {
  title: "Why Choose Us",
  description:
    "Manage the section heading, PAS badge, colours, spacing and unlimited feature cards.",
  count: data.whyChooseUsCount,
  countLabel:
    data.whyChooseUsCount === 1
      ? "card"
      : "cards",
  href:
    "/admin/website/homepage/why-choose-us",
  addLabel:
    "Add Card",
  addHref:
    "/admin/website/homepage/why-choose-us#why-choose-us-cards",
  status:
    data.whyChooseUsCount > 0
      ? "Configured"
      : "Needs content",
  icon: ShieldCheck,
},
    {
      title: "How We Work",
      description:
        "Control the process journeys for local authorities, contractors and households.",
      count: data.workProcessCount,
      countLabel: data.workProcessCount === 1 ? "group" : "groups",
      href: "/admin/website/homepage/how-we-work",
      addLabel: "Add Process Group",
      addHref: "/admin/website/homepage/how-we-work/new",
      status: data.workProcessCount > 0 ? "Configured" : "Needs content",
      icon: Building2,
    },
    {
      title: "Testimonials",
      description:
        "Add customer reviews, ratings, source links and publication settings.",
      count: data.testimonialsCount,
      countLabel: data.testimonialsCount === 1 ? "review" : "reviews",
      href: "/admin/website/homepage/testimonials",
      addLabel: "Add Testimonial",
      addHref: "/admin/website/homepage/testimonials/new",
      status: data.testimonialsCount > 0 ? "Configured" : "Needs content",
      icon: MessageSquareQuote,
    },
    {
      title: "Local Authorities",
      description:
        "Upload authority logos and manage names, links, locations and visibility.",
      count: data.localAuthoritiesCount,
      countLabel:
        data.localAuthoritiesCount === 1 ? "authority" : "authorities",
      href: "/admin/website/homepage/local-authorities",
      addLabel: "Add Authority",
      addHref: "/admin/website/homepage/local-authorities/new",
      status: data.localAuthoritiesCount > 0 ? "Configured" : "Needs content",
      icon: Home,
    },
    {
      title: "Call to Action",
      description:
        "Manage the final homepage heading, description, contact button and quotation link.",
      count: null,
      countLabel: "",
      href: "/admin/website/homepage/cta",
      addLabel: "Edit CTA",
      addHref: "/admin/website/homepage/cta",
      status: "Manage section",
      icon: Sparkles,
    },
  ];

  const configuredSections = managerItems.filter(
    (item) => item.status === "Configured",
  ).length;

  return (
    <div className="homepageManager">
      <header className="homepageManager__header">
        <div>
          <div className="homepageManager__breadcrumb">
            <Link href="/admin/dashboard">Dashboard</Link>
            <span>/</span>
            <Link href="/admin/website/homepage">Website</Link>
            <span>/</span>
            <strong>Homepage</strong>
          </div>

          <div className="homepageManager__titleRow">
            <div className="homepageManager__titleIcon">
              <LayoutTemplate size={25} strokeWidth={1.8} />
            </div>

            <div>
              <span className="homepageManager__eyebrow">
                Website management
              </span>

              <h1>Homepage Manager</h1>

              <p>
                Manage the complete Warm Life homepage without changing its
                existing design, theme or scroll experience.
              </p>
            </div>
          </div>
        </div>

        <div className="homepageManager__headerActions">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="homepageManager__previewButton"
          >
            Preview website
            <ArrowRight size={16} />
          </a>

          <Link
            href="/admin/website/homepage/settings"
            className="homepageManager__settingsButton"
          >
            <Settings2 size={17} />
            Page settings
          </Link>
        </div>
      </header>

      <section className="homepageManager__summary">
        <article className="homepageSummaryCard homepageSummaryCard--primary">
          <div className="homepageSummaryCard__icon">
            <Home size={21} />
          </div>

          <div>
            <span>Homepage status</span>
            <strong>{data.homepageStatus}</strong>
          </div>

          <span
            className={`homepageSummaryCard__status ${
              data.homepageStatus === "Published"
                ? "isPublished"
                : "isDraft"
            }`}
          >
            {data.homepageStatus}
          </span>
        </article>

        <article className="homepageSummaryCard">
          <div className="homepageSummaryCard__icon">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>Configured sections</span>
            <strong>
              {configuredSections} / {managerItems.length}
            </strong>
          </div>
        </article>

        <article className="homepageSummaryCard">
          <div className="homepageSummaryCard__icon">
            <Bot size={21} />
          </div>

          <div>
            <span>CMS mode</span>
            <strong>Database connected</strong>
          </div>
        </article>
      </section>

      <section className="homepageManager__section">
        <div className="homepageManager__sectionHeading">
          <div>
            <span>Homepage content</span>
            <h2>Manage every section</h2>
          </div>

          <p>
            Content can change freely while the approved Warm Life layout,
            colours and visual identity remain protected.
          </p>
        </div>

        <div className="homepageManager__grid">
          {managerItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <article
                className="homepageSectionCard"
                key={item.title}
              >
                <div className="homepageSectionCard__top">
                  <div className="homepageSectionCard__icon">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>

                  <span className="homepageSectionCard__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="homepageSectionCard__content">
                  <span className="homepageSectionCard__status">
                    {item.status}
                  </span>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>
                </div>

                <div className="homepageSectionCard__footer">
                  {item.count !== null ? (
                    <div className="homepageSectionCard__count">
                      <strong>{item.count}</strong>
                      <span>{item.countLabel}</span>
                    </div>
                  ) : (
                    <div className="homepageSectionCard__count">
                      <strong>CTA</strong>
                      <span>section</span>
                    </div>
                  )}

                  <div className="homepageSectionCard__actions">
                    <Link
                      href={item.addHref}
                      className="homepageSectionCard__add"
                    >
                      + {item.addLabel}
                    </Link>

                    <Link
                      href={item.href}
                      className="homepageSectionCard__manage"
                    >
                      Open Editor
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}