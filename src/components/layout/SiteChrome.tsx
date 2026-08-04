"use client";

import { usePathname } from "next/navigation";

import EnergyAssistant from "@/components/chat/EnergyAssistant";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import type { SiteHeaderData } from "@/lib/types/site-header";
import type { SiteFooterData } from "@/lib/types/site-footer";

type SiteChromeProps = {
  children: React.ReactNode;
  siteHeaderData: SiteHeaderData;
  siteFooterData: SiteFooterData;
};

export default function SiteChrome({
  children,
  siteHeaderData,
  siteFooterData,
}: SiteChromeProps) {
  const pathname = usePathname();

  const isAdminRoute =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  const overlayRoutes = [
    "/",
    "/about",
    "/services",
    "/blogs",
    "/case-studies",
    "/contact",
  ];

  const shouldOverlay = overlayRoutes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`),
  );

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar
        data={siteHeaderData}
        overlay={shouldOverlay}
      />

      {children}

      <Footer data={siteFooterData} />

      <EnergyAssistant />
    </>
  );
}