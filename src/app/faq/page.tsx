import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/common/PageHero";
export const metadata: Metadata = { title: "Frequently Asked Questions", description: "Answers to common questions about Warm Life services." };
const faqs=[
["How do I know which upgrade is right for my home?","The right measure depends on the property, its current energy performance and your priorities. An assessment helps identify the most suitable sequence."],
["Can Warm Life help with eligibility?","Yes. Our team can discuss your circumstances and explain what information may be required for available support routes."],
["Do all homes qualify for every measure?","No. Suitability can depend on construction type, existing systems, condition and technical survey findings."],
["How long does the process take?","Timescales vary by measure and property. We explain expected stages after the initial assessment."]];
export default function FaqPage(){return <><Navbar/><main className="innerPage"><PageHero eyebrow="FAQs" title="Straight answers before you get started." description="Common questions about suitability, eligibility and the home improvement process."/><section className="contentSection"><div className="shell faqList">{faqs.map(([q,a],i)=><article key={q}><span>{String(i+1).padStart(2,"0")}</span><div><h2>{q}</h2><p>{a}</p></div></article>)}</div></section></main><Footer/></>}
