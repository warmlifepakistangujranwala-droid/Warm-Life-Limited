/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/about/mission-vision/page.tsx
 *
 * Purpose :
 * Loads About Mission and Vision settings and renders the
 * complete section CMS editor.
 *
 * Version : v1.0.0
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowLeft,
  Flag,
  Info,
} from "lucide-react";

import {
  getAboutPageSettings,
} from "@/lib/actions/about-page";

import MissionVisionForm from "./MissionVisionForm";
import "./mission-vision.css";

export default async function AboutMissionVisionPage() {
  const settings =
    await getAboutPageSettings();

  if (!settings) {
    return (
      <div className="missionVisionAdmin">
        <div className="missionVisionAdmin__missing">
          <Info size={30} />

          <h1>
            Mission and Vision settings not found
          </h1>

          <p>
            Confirm that the About page default
            settings record exists in Supabase.
          </p>

          <Link href="/admin/website/about">
            Return to About Manager
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="missionVisionAdmin">
      <header className="missionVisionAdmin__header">
        <div>
          <div className="missionVisionAdmin__breadcrumb">
            <Link href="/admin/dashboard">
              Dashboard
            </Link>

            <span>/</span>

            <Link href="/admin/website/about">
              About Page
            </Link>

            <span>/</span>

            <strong>
              Mission &amp; Vision
            </strong>
          </div>

          <div className="missionVisionAdmin__titleRow">
            <div className="missionVisionAdmin__titleIcon">
              <Flag
                size={25}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <span className="missionVisionAdmin__eyebrow">
                About page content
              </span>

              <h1>
                Mission &amp; Vision
              </h1>

              <p>
                Manage the section content, cards,
                icons, typography, colours, spacing
                and three-dimensional interactions.
              </p>
            </div>
          </div>
        </div>

        <div className="missionVisionAdmin__headerActions">
          <Link
            href="/admin/website/about"
            className="missionVisionAdmin__backButton"
          >
            <ArrowLeft size={16} />
            About Manager
          </Link>

          <a
            href="/about#mission-vision"
            target="_blank"
            rel="noreferrer"
            className="missionVisionAdmin__previewButton"
          >
            Preview Section
          </a>
        </div>
      </header>

      <MissionVisionForm
        settings={settings}
      />
    </div>
  );
}
