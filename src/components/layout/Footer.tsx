import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, Phone } from "lucide-react";

const serviceLinks = [
  ["Solar panels", "/services#solar"],
  ["Loft insulation", "/services#loft-insulation"],
  ["Cavity wall insulation", "/services#cavity-wall-insulation"],
  ["Air source heat pumps", "/services#air-source-heat-pumps"]
] as const;

export default function Footer() {
  return (
    <footer className="siteFooter">
      <div className="shell footerGrid">
        <div className="footerBrand">
          <Image
            src="/images/warm-life-logo.png"
            alt="Warm Life Limited"
            width={390}
            height={126}
          />
          <p>
            Helping households create warmer, more comfortable and more energy-efficient homes.
          </p>
        </div>

        <div>
          <h3>Explore</h3>
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/case-studies">Case Studies</Link>
          <Link href="/blogs">Blogs</Link>
        </div>

        <div>
          <h3>Services</h3>
          {serviceLinks.map(([label, href]) => (
            <Link href={href} key={href}>{label}</Link>
          ))}
        </div>

        <div>
          <h3>Contact</h3>
          <a href="tel:+442038399999"><Phone size={15} /> +44 (0)20 3839 9999</a>
          <a href="mailto:hello@warmlife.co.uk"><Mail size={15} /> hello@warmlife.co.uk</a>
          <Link href="/contact">Start an enquiry <ArrowUpRight size={15} /></Link>
        </div>
      </div>

      <div className="shell footerBottom">
        <span>© {new Date().getFullYear()} Warm Life Limited</span>
        <div>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms">Terms & Conditions</Link>
          <Link href="/faq">FAQs</Link>
        </div>
      </div>
    </footer>
  );
}
