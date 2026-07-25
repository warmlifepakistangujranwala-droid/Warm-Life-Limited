import Link from "next/link";
import { ArrowRight } from "lucide-react";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  cta?: { label: string; href: string };
};

export default function PageHero({ eyebrow, title, description, cta }: PageHeroProps) {
  return (
    <section className="pageHero">
      <div className="pageHeroGlow pageHeroGlowOne" />
      <div className="pageHeroGlow pageHeroGlowTwo" />
      <div className="shell pageHeroInner">
        <span className="pageEyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        {cta && (
          <Link className="primaryButton" href={cta.href}>
            {cta.label}
            <ArrowRight size={18} />
          </Link>
        )}
      </div>
    </section>
  );
}
