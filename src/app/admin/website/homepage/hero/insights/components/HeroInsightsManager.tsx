import Link from "next/link";

import {
  deleteHeroInsight,
  setHeroInsightVisibility,
} from "@/lib/actions/hero-insight";

import type { HeroSlide } from "@/lib/types/hero";
import type { HeroInsight } from "@/lib/types/hero-insight";

type HeroInsightsManagerProps = {
  insights: HeroInsight[];
  heroSlides: HeroSlide[];
  statistics: {
    total: number;
    visible: number;
    hidden: number;
  };
};

/* ==========================================================
   DELETE HERO INSIGHT
========================================================== */

async function deleteHeroInsightAction(formData: FormData) {
  "use server";

  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    return;
  }

  await deleteHeroInsight(id);
}

/* ==========================================================
   TOGGLE HERO INSIGHT VISIBILITY
========================================================== */

async function toggleHeroInsightVisibilityAction(
  formData: FormData,
) {
  "use server";

  const id = formData.get("id");
  const visible = formData.get("visible");

  if (typeof id !== "string" || !id) {
    return;
  }

  await setHeroInsightVisibility(
    id,
    visible === "true",
  );
}

/* ==========================================================
   HERO INSIGHTS MANAGER
========================================================== */

export function HeroInsightsManager({
  insights,
  heroSlides,
  statistics,
}: HeroInsightsManagerProps) {
  const getSlideTitle = (id: string | null) => {
    if (!id) {
      return "-";
    }

    const slide = heroSlides.find(
      (item) => item.id === id,
    );

    if (!slide) {
      return "Unknown Slide";
    }

    return [
      slide.title_line_one,
      slide.title_line_two,
    ]
      .filter(Boolean)
      .join(" ");
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Hero Insights</h1>

          <p>
            Manage the information cards displayed for each hero
            slide.
          </p>
        </div>

        <Link
          href="/admin/website/homepage/hero/insights/add"
          className="btn btn-primary"
        >
          + Add Insight
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total</h3>
          <strong>{statistics.total}</strong>
        </div>

        <div className="stat-card">
          <h3>Visible</h3>
          <strong>{statistics.visible}</strong>
        </div>

        <div className="stat-card">
          <h3>Hidden</h3>
          <strong>{statistics.hidden}</strong>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Slide</th>
              <th>Label</th>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th style={{ width: 240 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {insights.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: "center",
                  }}
                >
                  No Hero Insights Found
                </td>
              </tr>
            ) : (
              insights.map((insight) => (
                <tr key={insight.id}>
                  <td>{insight.display_order}</td>

                  <td>
                    {getSlideTitle(
                      insight.hero_slide_id,
                    )}
                  </td>

                  <td>{insight.label}</td>

                  <td>{insight.title}</td>

                  <td>
                    {insight.description || "-"}
                  </td>

                  <td>
                    {insight.is_visible ? (
                      <span className="badge badge-success">
                        Visible
                      </span>
                    ) : (
                      <span className="badge badge-secondary">
                        Hidden
                      </span>
                    )}
                  </td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      <Link
                        href={`/admin/website/homepage/hero/insights/${insight.id}/edit`}
                        className="btn btn-sm"
                      >
                        Edit
                      </Link>

                      <form
                        action={
                          toggleHeroInsightVisibilityAction
                        }
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={insight.id}
                        />

                        <input
                          type="hidden"
                          name="visible"
                          value={
                            insight.is_visible
                              ? "false"
                              : "true"
                          }
                        />

                        <button
                          type="submit"
                          className="btn btn-sm"
                        >
                          {insight.is_visible
                            ? "Hide"
                            : "Show"}
                        </button>
                      </form>

                      <form
                        action={deleteHeroInsightAction}
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={insight.id}
                        />

                        <button
                          type="submit"
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}