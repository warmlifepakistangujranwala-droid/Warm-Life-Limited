import type { Metadata } from "next";

// import SiteChrome from "@/components/layout/SiteChrome";
import SiteChrome from "@/components/layout/SiteChrome";
import { getSiteHeaderData } from "@/lib/actions/site-header";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default:
      "Warm Life | A Warmer, More Efficient Home",
    template: "%s | Warm Life",
  },
  description:
    "Heating, insulation and renewable energy upgrades for homes across the UK.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteHeaderData =
    await getSiteHeaderData();

  return (
    <html lang="en">
      <body>
        <SiteChrome
          siteHeaderData={
            siteHeaderData
          }
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}