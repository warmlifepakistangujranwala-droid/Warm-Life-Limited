"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { services } from "@/data/services";

type NavbarProps = {
  overlay?: boolean;
};

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({ overlay = false }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
  };

  return (
    <header className={`nav ${overlay ? "navOverlay" : "navStatic"}`}>
      <div className="shell navInner">
        <Link
          className="brand"
          href="/"
          aria-label="Warm Life Limited home"
          onClick={closeMobileMenu}
        >
          <Image
            src="/images/warm-life-logo.png"
            alt="Warm Life Limited"
            width={390}
            height={126}
            priority
          />
        </Link>

        <nav className="navLinks" aria-label="Primary navigation">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>

          <div className="navDropdown">
            <Link href="/services">
              Services <ChevronDown size={13} />
            </Link>

            <div className="navDropdownPanel">
              <div>
                <span>Home-energy services</span>
                <strong>Build the right plan for your property.</strong>

                <Link href="/services">
                  View all services <ArrowRight size={14} />
                </Link>
              </div>

              <nav>
                {services.map((service) => (
                  <Link
                    href={`/services/${service.id}`}
                    key={service.id}
                  >
                    <small>{service.number}</small>
                    {service.shortTitle}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {links.slice(2).map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="navActions">
          <Link
            className="navCta"
            href="/contact#eligibility"
            onClick={closeMobileMenu}
          >
            Check eligibility <ArrowRight size={16} />
          </Link>

          <button
            type="button"
            className="mobileMenuButton"
            aria-label={
              mobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((current) => !current)}
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      <div
        className={`mobileMenu ${
          mobileMenuOpen ? "mobileMenuOpen" : ""
        }`}
      >
        <Link href="/" onClick={closeMobileMenu}>
          Home
        </Link>

        <Link href="/about" onClick={closeMobileMenu}>
          About
        </Link>

        <button
          type="button"
          className="mobileServicesButton"
          onClick={() =>
            setMobileServicesOpen((current) => !current)
          }
          aria-expanded={mobileServicesOpen}
        >
          <span>Services</span>
          <ChevronDown
            size={17}
            className={
              mobileServicesOpen
                ? "mobileServicesChevronOpen"
                : ""
            }
          />
        </button>

        {mobileServicesOpen && (
          <div className="mobileServicesList">
            <Link href="/services" onClick={closeMobileMenu}>
              View all services
            </Link>

            {services.map((service) => (
              <Link
                href={`/services/${service.id}`}
                key={service.id}
                onClick={closeMobileMenu}
              >
                <small>{service.number}</small>
                <span>{service.shortTitle}</span>
              </Link>
            ))}
          </div>
        )}

        <Link href="/case-studies" onClick={closeMobileMenu}>
          Case Studies
        </Link>

        <Link href="/blogs" onClick={closeMobileMenu}>
          Blogs
        </Link>

        <Link href="/contact" onClick={closeMobileMenu}>
          Contact
        </Link>
      </div>
    </header>
  );
}