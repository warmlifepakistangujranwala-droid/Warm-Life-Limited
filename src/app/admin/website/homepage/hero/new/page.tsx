import Link from "next/link";
import { ArrowLeft, Home, PlusCircle } from "lucide-react";

// import HeroForm from "./HeroForm";
import HeroForm from "./HeroForm"
import "./hero-form.css";

export default function NewHeroSlidePage() {
  return (
    <div className="heroFormPage">
      <header className="heroFormPage__header">
        <div>
          <div className="heroFormPage__breadcrumb">
            <Link href="/admin/dashboard">Dashboard</Link>
            <span>/</span>

            <Link href="/admin/website/homepage">Homepage</Link>
            <span>/</span>

            <Link href="/admin/website/homepage/hero">Hero</Link>
            <span>/</span>

            <strong>Add Hero Video</strong>
          </div>

          <div className="heroFormPage__titleRow">
            <div className="heroFormPage__titleIcon">
              <PlusCircle size={25} strokeWidth={1.8} />
            </div>

            <div>
              <span className="heroFormPage__eyebrow">
                Homepage hero
              </span>

              <h1>Add Hero Video</h1>

              <p>
                Upload a new homepage hero video and configure its heading,
                description, buttons, status and display order.
              </p>
            </div>
          </div>
        </div>

        <div className="heroFormPage__headerActions">
          <Link
            href="/admin/website/homepage"
            className="heroFormPage__homepageButton"
          >
            <Home size={16} />
            Homepage
          </Link>

          <Link
            href="/admin/website/homepage/hero"
            className="heroFormPage__backButton"
          >
            <ArrowLeft size={16} />
            Back to Hero Manager
          </Link>
        </div>
      </header>

      <HeroForm />
    </div>
  );
}