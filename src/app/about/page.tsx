import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/common/PageHero";

export const metadata: Metadata = {
  title: "About Warm Life",
  description: "Learn how Warm Life helps households improve comfort and energy efficiency."
};

export default function AboutPage() {
  return <>
    
    <main className="innerPage">
      <PageHero eyebrow="About Warm Life" title="Home energy upgrades, delivered with clarity." description="We help households understand, plan and access improvements that make homes warmer, more comfortable and more efficient." cta={{ label: "Speak to our team", href: "/contact" }} />
      <section className="contentSection"><div className="shell splitContent"><div><span className="pageEyebrow">Our approach</span><h2>One connected plan for the whole home.</h2></div><div><p>Every property is different. We look at the building fabric, heating system and household needs before recommending the right next steps.</p><p>Our aim is to make complex energy upgrades easier to understand—from initial eligibility and survey through to installation and aftercare.</p></div></div></section>
      <section className="contentSection softSection"><div className="shell featureGrid"><article><strong>01</strong><h3>Assess</h3><p>Understand the property, current performance and household priorities.</p></article><article><strong>02</strong><h3>Plan</h3><p>Create a practical sequence of improvements around the home.</p></article><article><strong>03</strong><h3>Deliver</h3><p>Coordinate suitable installation work with clear communication.</p></article></div></section>
    </main>
    <Footer />
  </>;
}
