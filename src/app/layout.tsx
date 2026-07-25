import type { Metadata } from "next";
import EnergyAssistant from "@/components/chat/EnergyAssistant";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Warm Life | A Warmer, More Efficient Home", template: "%s | Warm Life" },
  description: "Heating, insulation and renewable energy upgrades for homes across the UK."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<EnergyAssistant /></body></html>;
}
