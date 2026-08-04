/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/about/page.tsx
 *
 * Purpose :
 * Main About Us CMS manager page. Displays page status,
 * section status, collection counts and editor links.
 *
 * Version : v1.0.0
 * ============================================================
 */


import type { ComponentType } from "react";

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  FileText,
  Flag,
  Image,
  Info,
  LayoutTemplate,
  Users,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import "./about.css";

type AboutManagerItem = {
  title: string;
  description: string;
  count: number | null;
  countLabel: string;
  href: string;
  addLabel: string;
  addHref: string;
  status: string;
  icon: ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
};

async function getTableCount(
  tableName:
    | "about_hero_slides"
    | "about_departments"
    | "about_team_members",
): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from(tableName)
    .select("*", {
      count: "exact",
      head: true,
    });

  if (error) {
    console.error(
      `Could not count ${tableName}:`,
      error.message,
    );

    return 0;
  }

  return count ?? 0;
}

async function getAboutPageStatus(): Promise<
  "Published" | "Draft"
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("about_page_settings")
    .select("is_published")
    .order("display_order", {
      ascending: true,
    })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(
      "Could not load About page status:",
      error.message,
    );

    return "Draft";
  }

  return data?.is_published
    ? "Published"
    : "Draft";
}

async function getAboutManagerData() {
  const [
    pageStatus,
    heroSlidesCount,
    departmentsCount,
    teamMembersCount,
  ] = await Promise.all([
    getAboutPageStatus(),
    getTableCount("about_hero_slides"),
    getTableCount("about_departments"),
    getTableCount("about_team_members"),
  ]);

  return {
    pageStatus,
    heroSlidesCount,
    departmentsCount,
    teamMembersCount,
  };
}

export default async function AboutManagerPage() {
  const data = await getAboutManagerData();

  const managerItems: AboutManagerItem[] = [
    {
      title: "Hero",
      description:
        "Manage hero images, videos, slider content, typography, colours, spacing, buttons and media settings.",
      count: data.heroSlidesCount,
      countLabel:
        data.heroSlidesCount === 1
          ? "slide"
          : "slides",
      href:
        "/admin/website/about/hero",
      addLabel:
        "Add Hero Slide",
      addHref:
        "/admin/website/about/hero#hero-slides",
      status:
        data.heroSlidesCount > 0
          ? "Configured"
          : "Needs content",
      icon: Image,
    },
    {
      title: "Company Information",
      description:
        "Manage the company story, section image, typography, colours, layout, spacing and image presentation.",
      count: null,
      countLabel: "",
      href:
        "/admin/website/about/company",
      addLabel:
        "Edit Section",
      addHref:
        "/admin/website/about/company",
      status:
        "Manage section",
      icon: Building2,
    },
    {
      title: "Mission & Vision",
      description:
        "Manage mission and vision content, icons, cards, typography, colours, spacing and section layout.",
      count: null,
      countLabel: "",
      href:
        "/admin/website/about/mission-vision",
      addLabel:
        "Edit Section",
      addHref:
        "/admin/website/about/mission-vision",
      status:
        "Manage section",
      icon: Flag,
    },
    {
      title: "Departments",
      description:
        "Create unlimited departments and control names, descriptions, icons, status and display order.",
      count: data.departmentsCount,
      countLabel:
        data.departmentsCount === 1
          ? "department"
          : "departments",
      href:
        "/admin/website/about/departments",
      addLabel:
        "Add Department",
      addHref:
        "/admin/website/about/departments#add-department",
      status:
        data.departmentsCount > 0
          ? "Configured"
          : "Needs content",
      icon: LayoutTemplate,
    },
    {
      title: "Team Members",
      description:
        "Add unlimited team members and manage departments, biographies, qualifications, images and visibility.",
      count: data.teamMembersCount,
      countLabel:
        data.teamMembersCount === 1
          ? "team member"
          : "team members",
      href:
        "/admin/website/about/team",
      addLabel:
        "Add Team Member",
      addHref:
        "/admin/website/about/team#add-team-member",
      status:
        data.teamMembersCount > 0
          ? "Configured"
          : "Needs content",
      icon: Users,
    },
    {
      title: "Closing Statement",
      description:
        "Manage the professional closing statement, typography, colours, alignment, width and section spacing.",
      count: null,
      countLabel: "",
      href:
        "/admin/website/about/closing",
      addLabel:
        "Edit Section",
      addHref:
        "/admin/website/about/closing",
      status:
        "Manage section",
      icon: FileText,
    },
  ];

  const configuredSections =
    managerItems.filter(
      (item) =>
        item.status === "Configured" ||
        item.status === "Manage section",
    ).length;

  return (
    <div className="aboutManager">
      <header className="aboutManager__header">
        <div>
          <div className="aboutManager__breadcrumb">
            <Link href="/admin/dashboard">
              Dashboard
            </Link>

            <span>/</span>

            <Link href="/admin/website/homepage">
              Website
            </Link>

            <span>/</span>

            <strong>About Page</strong>
          </div>

          <div className="aboutManager__titleRow">
            <div className="aboutManager__titleIcon">
              <Info
                size={25}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <span className="aboutManager__eyebrow">
                Website management
              </span>

              <h1>About Page Manager</h1>

              <p>
                Manage every section of the Warm Life
                About page while keeping the approved
                website structure, branding and user
                experience consistent.
              </p>
            </div>
          </div>
        </div>

        <div className="aboutManager__headerActions">
          <a
            href="/about"
            target="_blank"
            rel="noreferrer"
            className="aboutManager__previewButton"
          >
            Preview page
            <ArrowRight size={16} />
          </a>
        </div>
      </header>

      <section className="aboutManager__summary">
        <article className="aboutSummaryCard aboutSummaryCard--primary">
          <div className="aboutSummaryCard__icon">
            <Info size={21} />
          </div>

          <div>
            <span>About page status</span>
            <strong>{data.pageStatus}</strong>
          </div>

          <span
            className={`aboutSummaryCard__status ${
              data.pageStatus === "Published"
                ? "isPublished"
                : "isDraft"
            }`}
          >
            {data.pageStatus}
          </span>
        </article>

        <article className="aboutSummaryCard">
          <div className="aboutSummaryCard__icon">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>Configured sections</span>
            <strong>
              {configuredSections} / {managerItems.length}
            </strong>
          </div>
        </article>

        <article className="aboutSummaryCard">
          <div className="aboutSummaryCard__icon">
            <Bot size={21} />
          </div>

          <div>
            <span>CMS mode</span>
            <strong>Database connected</strong>
          </div>
        </article>
      </section>

      <section className="aboutManager__section">
        <div className="aboutManager__sectionHeading">
          <div>
            <span>About page content</span>
            <h2>Manage every section</h2>
          </div>

          <p>
            Each section has its own editor and can be
            updated independently from the admin panel.
          </p>
        </div>

        <div className="aboutManager__grid">
          {managerItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <article
                className="aboutSectionCard"
                key={item.title}
              >
                <div className="aboutSectionCard__top">
                  <div className="aboutSectionCard__icon">
                    <Icon
                      size={22}
                      strokeWidth={1.8}
                    />
                  </div>

                  <span className="aboutSectionCard__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="aboutSectionCard__content">
                  <span className="aboutSectionCard__status">
                    {item.status}
                  </span>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>
                </div>

                <div className="aboutSectionCard__footer">
                  {item.count !== null ? (
                    <div className="aboutSectionCard__count">
                      <strong>{item.count}</strong>
                      <span>{item.countLabel}</span>
                    </div>
                  ) : (
                    <div className="aboutSectionCard__count">
                      <strong>Edit</strong>
                      <span>section</span>
                    </div>
                  )}

                  <div className="aboutSectionCard__actions">
                    <Link
                      href={item.addHref}
                      className="aboutSectionCard__add"
                    >
                      + {item.addLabel}
                    </Link>

                    <Link
                      href={item.href}
                      className="aboutSectionCard__manage"
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