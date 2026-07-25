import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getService, services } from "@/data/services";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: `${service.title} | Warm Life`,
    description: service.summary
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = services.filter((item) => item.id !== service.id).slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="innerPage">
        <section className="serviceDetailHero">
          <div className="shell serviceDetailHeroInner">
            <div>
              <span className="pageEyebrow">Warm Life service {service.number}</span>
              <h1>{service.title}</h1>
              <p>{service.intro}</p>
              <div className="heroActions">
                <Link className="primaryButton" href={`/contact?service=${service.id}#eligibility`}>Check eligibility <ArrowRight size={17} /></Link>
                <Link className="textButton" href="/services">All services <ChevronRight size={16} /></Link>
              </div>
            </div>
            <div className="serviceHeroCard">
              <span>What this can help with</span>
              <ul>{service.benefits.map((benefit) => <li key={benefit}><Check size={18} />{benefit}</li>)}</ul>
            </div>
          </div>
        </section>

        <section className="contentSection">
          <div className="shell sectionHeadingRow">
            <div><span className="pageEyebrow">How it works</span><h2>A clear route from assessment to completion.</h2></div>
            <p>Every recommendation is subject to a property assessment. We explain what is suitable, what happens next and how the work fits into the wider home.</p>
          </div>
          <div className="shell processGrid">
            {service.process.map((step, index) => <article key={step.title}><span>0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}
          </div>
        </section>

        <section className="contentSection softSection">
          <div className="shell faqDetailGrid">
            <div><span className="pageEyebrow">Common questions</span><h2>Useful answers before you begin.</h2><Link className="textButton" href="/faq">View all FAQs <ArrowRight size={16} /></Link></div>
            <div>{service.faqs.map((faq) => <article key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></article>)}</div>
          </div>
        </section>

        <section className="contentSection">
          <div className="shell"><div className="sectionHeadingRow compact"><div><span className="pageEyebrow">Related services</span><h2>Build a complete home-energy plan.</h2></div></div>
          <div className="relatedServiceGrid">{related.map((item) => <Link href={`/services/${item.id}`} key={item.id}><span>{item.number}</span><h3>{item.title}</h3><p>{item.summary}</p><strong>Explore service <ArrowRight size={15} /></strong></Link>)}</div></div>
        </section>

        <section className="shell ctaPanel"><div><span className="pageEyebrow">Take the next step</span><h2>Find out what may be suitable for your home.</h2></div><Link className="primaryButton" href={`/contact?service=${service.id}#eligibility`}>Start eligibility check <ArrowRight size={17} /></Link></section>
      </main>
      <Footer />
    </>
  );
}
