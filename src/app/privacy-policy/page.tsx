import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/common/PageHero";
export const metadata: Metadata={title:"Privacy Policy"};
export default function PrivacyPage(){return <><main className="innerPage"><PageHero eyebrow="Legal" title="Privacy Policy" description="How Warm Life Limited handles information submitted through this website."/><section className="contentSection"><div className="shell legalCopy"><h2>Information we collect</h2><p>We may collect contact details and property information that you provide when making an enquiry.</p><h2>How information is used</h2><p>Information may be used to respond to enquiries, assess service suitability, arrange appointments and improve our services.</p><h2>Your choices</h2><p>You may contact us to ask about the personal information we hold or to request a correction.</p><p className="legalNotice">This page is an initial website placeholder and should be reviewed against Warm Life Limited's final legal and data-processing requirements before launch.</p></div></section></main></>}
