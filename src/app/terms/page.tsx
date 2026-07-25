import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/common/PageHero";
export const metadata: Metadata={title:"Terms & Conditions"};
export default function TermsPage(){return <><Navbar/><main className="innerPage"><PageHero eyebrow="Legal" title="Terms & Conditions" description="The general terms governing use of the Warm Life Limited website."/><section className="contentSection"><div className="shell legalCopy"><h2>Website information</h2><p>Website content is provided for general information and does not replace a property assessment, technical survey or formal quotation.</p><h2>Service suitability</h2><p>All measures are subject to eligibility, property suitability, survey findings and applicable programme requirements.</p><h2>Changes</h2><p>Warm Life Limited may update website information and these terms as services develop.</p><p className="legalNotice">This page is an initial website placeholder and should be legally reviewed before the website is published.</p></div></section></main><Footer/></>}
