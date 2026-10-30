import type { MetadataRoute } from "next";

const baseUrl = "https://solar.warmlifeltd.co.uk";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/about",
    "/services",
    "/case-studies",
    "/blogs",
    "/contact",
    "/faq",
    "/privacy-policy",
    "/terms",
  ];

  return pages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));
}