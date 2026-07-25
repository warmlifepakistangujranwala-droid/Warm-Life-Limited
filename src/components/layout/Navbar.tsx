import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { services } from "@/data/services";

type NavbarProps = { overlay?: boolean };

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact", label: "Contact" }
];

export default function Navbar({ overlay = false }: NavbarProps) {
  return (
    <header className={`nav ${overlay ? "navOverlay" : "navStatic"}`}>
      <div className="shell navInner">
        <Link className="brand" href="/" aria-label="Warm Life Limited home">
          <Image src="/images/warm-life-logo.png" alt="Warm Life Limited" width={390} height={126} priority />
        </Link>
        <nav className="navLinks" aria-label="Primary navigation">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <div className="navDropdown">
            <Link href="/services">Services <ChevronDown size={13} /></Link>
            <div className="navDropdownPanel">
              <div><span>Home-energy services</span><strong>Build the right plan for your property.</strong><Link href="/services">View all services <ArrowRight size={14} /></Link></div>
              <nav>{services.map((service) => <Link href={`/services/${service.id}`} key={service.id}><small>{service.number}</small>{service.shortTitle}</Link>)}</nav>
            </div>
          </div>
          {links.slice(2).map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
        </nav>
        <Link className="navCta" href="/contact#eligibility">Check eligibility <ArrowRight size={16} /></Link>
      </div>
    </header>
  );
}
