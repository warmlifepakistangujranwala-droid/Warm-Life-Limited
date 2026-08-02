import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/common/PageHero";
import { services } from "@/data/services";

export const metadata: Metadata = { title: "Home Energy Services", description: "Explore Warm Life home energy efficiency services." };

export default function ServicesPage() {
  return <>
    
    <main className="innerPage">
      <PageHero eyebrow="Our services" title="A complete route to a warmer, more efficient home." description="Explore upgrades for energy generation, insulation, heating and whole-home performance." cta={{ label: "Check eligibility", href: "/contact#eligibility" }} />
      <section className="contentSection"><div className="shell serviceCardGrid">
        {services.map((service) => <article className="serviceCard" id={service.id} key={service.id}><span>{service.number}</span><h2>{service.title}</h2><p>{service.summary}</p><ul>{service.benefits.slice(0, 3).map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul><Link href={`/services/${service.id}`}>Explore this service <ArrowRight size={16} /></Link></article>)}
      </div></section>
    </main>
    <Footer />
  </>;
}
