import type { Metadata } from "next";

import SiteChrome from "@/components/layout/SiteChrome";

import { getSiteHeaderData } from "@/lib/actions/site-header";
import { getSiteFooterData } from "@/lib/actions/site-footer";

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
  const [
    siteHeaderData,
    siteFooterData,
  ] = await Promise.all([
    getSiteHeaderData(),
    getSiteFooterData(),
  ]);

  return (
    <html lang="en">
      <body>
        <SiteChrome
          siteHeaderData={siteHeaderData}
          siteFooterData={siteFooterData}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}