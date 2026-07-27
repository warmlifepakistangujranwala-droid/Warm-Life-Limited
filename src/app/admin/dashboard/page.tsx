/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : page.tsx
 * Route   : /admin/dashboard
 *
 * Purpose :
 * Displays the primary overview for the Warm Life CMS.
 *
 * Version : v0.3.0
 * ============================================================
 */

import Link from "next/link";

import "./dashboard.css";

/**
 * Dashboard summary cards.
 *
 * These values are currently placeholders and will later
 * be loaded dynamically from Supabase.
 */
const dashboardStatistics = [
  {
    label: "Website pages",
    value: "8",
    description: "Published public pages",
    icon: "▤",
  },
  {
    label: "Services",
    value: "6",
    description: "Active service listings",
    icon: "◇",
  },
  {
    label: "Blog posts",
    value: "0",
    description: "Published articles",
    icon: "✎",
  },
  {
    label: "New enquiries",
    value: "0",
    description: "Awaiting review",
    icon: "◎",
  },
];

/**
 * Quick CMS management actions.
 */
const quickActions = [
  {
    title: "Manage website",
    description: "Update homepage and public page content.",
    href: "/admin/website",
    icon: "◫",
  },
  {
    title: "Manage services",
    description: "Create, edit and publish service pages.",
    href: "/admin/services",
    icon: "◇",
  },
  {
    title: "Create blog post",
    description: "Write and publish a new article.",
    href: "/admin/blogs",
    icon: "✎",
  },
  {
    title: "View enquiries",
    description: "Review website leads and customer messages.",
    href: "/admin/leads",
    icon: "◎",
  },
];

/**
 * Renders the Warm Life CMS dashboard.
 */
export default function DashboardPage() {
  return (
    <div className="admin-dashboard admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Administration overview</p>

          <h1 className="admin-page__title">Dashboard</h1>

          <p className="admin-page__description">
            Manage the Warm Life website, services, media, articles and
            customer enquiries from one secure dashboard.
          </p>
        </div>

        <Link
          className="admin-dashboard__view-website"
          href="/"
          target="_blank"
        >
          View live website
          <span aria-hidden="true">↗</span>
        </Link>
      </header>

      <section
        aria-label="Website statistics"
        className="admin-dashboard__statistics"
      >
        {dashboardStatistics.map((statistic) => (
          <article
            className="admin-dashboard__stat-card"
            key={statistic.label}
          >
            <div className="admin-dashboard__stat-top">
              <span className="admin-dashboard__stat-icon">
                {statistic.icon}
              </span>

              <span className="admin-dashboard__status-badge">Live</span>
            </div>

            <strong className="admin-dashboard__stat-value">
              {statistic.value}
            </strong>

            <h2>{statistic.label}</h2>

            <p>{statistic.description}</p>
          </article>
        ))}
      </section>

      <div className="admin-dashboard__content-grid">
        <section className="admin-dashboard__section">
          <div className="admin-dashboard__section-header">
            <div>
              <p className="admin-dashboard__section-eyebrow">
                Content management
              </p>

              <h2>Quick actions</h2>
            </div>
          </div>

          <div className="admin-dashboard__quick-actions">
            {quickActions.map((action) => (
              <Link
                className="admin-dashboard__action-card"
                href={action.href}
                key={action.href}
              >
                <span className="admin-dashboard__action-icon">
                  {action.icon}
                </span>

                <div>
                  <h3>{action.title}</h3>

                  <p>{action.description}</p>
                </div>

                <span
                  aria-hidden="true"
                  className="admin-dashboard__action-arrow"
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <aside className="admin-dashboard__section">
          <div className="admin-dashboard__section-header">
            <div>
              <p className="admin-dashboard__section-eyebrow">
                System information
              </p>

              <h2>Website status</h2>
            </div>
          </div>

          <div className="admin-dashboard__status-panel">
            <div className="admin-dashboard__website-status">
              <span className="admin-dashboard__online-indicator" />

              <div>
                <strong>Website online</strong>

                <p>All public pages are available.</p>
              </div>
            </div>

            <div className="admin-dashboard__status-row">
              <span>CMS access</span>
              <strong>Secure</strong>
            </div>

            <div className="admin-dashboard__status-row">
              <span>Database</span>
              <strong>Connected</strong>
            </div>

            <div className="admin-dashboard__status-row">
              <span>Authentication</span>
              <strong>Active</strong>
            </div>

            <div className="admin-dashboard__status-row">
              <span>Environment</span>
              <strong>Development</strong>
            </div>
          </div>
        </aside>
      </div>

      <section className="admin-dashboard__section admin-dashboard__activity">
        <div className="admin-dashboard__section-header">
          <div>
            <p className="admin-dashboard__section-eyebrow">
              Administration history
            </p>

            <h2>Recent activity</h2>
          </div>
        </div>

        <div className="admin-dashboard__empty-state">
          <span className="admin-dashboard__empty-icon">✓</span>

          <div>
            <h3>No recent activity</h3>

            <p>
              Website changes, published content and lead updates will appear
              here.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}