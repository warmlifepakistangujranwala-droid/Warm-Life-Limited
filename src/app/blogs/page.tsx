import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/common/PageHero";

export const metadata: Metadata = { title: "Home Energy Guides", description: "Warm Life guides about insulation, solar and home energy performance." };
const posts = [
  ["Energy efficiency", "How to plan home energy improvements in the right order", "A fabric-first overview of insulation, heating and renewable energy measures."],
  ["Insulation", "Why loft insulation is often an important first step", "Learn how roof-level heat loss affects comfort and household energy demand."],
  ["Solar", "What households should consider before installing solar panels", "Understand roof suitability, electricity use and the role of professional assessment."],
  ["EPC", "Understanding your EPC and its recommendations", "A straightforward guide to ratings, measures and next steps."]
];
export default function BlogsPage(){return <><main className="innerPage"><PageHero eyebrow="Warm Life journal" title="Clear guidance for a more efficient home." description="Practical articles to help households understand energy performance and make informed improvement decisions."/><section className="contentSection"><div className="shell blogGrid">{posts.map(([tag,title,text],i)=><article className="blogCard" key={title}><div className="blogNumber">{String(i+1).padStart(2,"0")}</div><small>{tag}</small><h2>{title}</h2><p>{text}</p><span>Guide coming soon</span></article>)}</div></section></main></>}
