import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/common/PageHero";

export const metadata: Metadata = { title: "Case Studies", description: "Warm Life home energy improvement case studies." };
const projects = [
  ["Greater Manchester", "Solar & insulation", "A coordinated package designed to reduce heat loss and support cleaner electricity generation."],
  ["West Midlands", "Loft & cavity wall", "Fabric-first improvements focused on comfort and more consistent indoor temperatures."],
  ["North West", "Heating upgrade", "A practical heating improvement journey planned around the property and household needs."]
];
export default function CaseStudiesPage(){return <><main className="innerPage"><PageHero eyebrow="Real homes" title="Energy upgrades shaped around each property." description="Explore examples of how different measures can work together as part of one home improvement journey."/><section className="contentSection"><div className="shell caseGrid">{projects.map(([place,title,text],i)=><article className="caseCard" key={title}><div className={`caseVisual caseVisual${i+1}`}><span>Project {String(i+1).padStart(2,"0")}</span></div><small>{place}</small><h2>{title}</h2><p>{text}</p></article>)}</div></section></main><Footer/></>}
