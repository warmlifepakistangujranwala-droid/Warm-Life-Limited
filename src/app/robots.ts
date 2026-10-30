import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/auth/"],
    },
    sitemap: "https://solar.warmlifeltd.co.uk/sitemap.xml",
  };
}