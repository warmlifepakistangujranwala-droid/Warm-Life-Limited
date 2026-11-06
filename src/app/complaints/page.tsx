import type { Metadata } from "next";
import PageHero from "@/components/common/PageHero";

export const metadata: Metadata = { title: "Complaints Policy" };

export default function ComplaintsPage() {
  return (
    <>
      <main className="innerPage">
        <PageHero
          eyebrow="Legal"
          title="Complaints Policy"
          description="How to raise a complaint about our work or about your finance agreement."
        />
        <section className="contentSection">
          <div className="shell legalCopy">
            <h2>Complaints about our Work</h2>
            <p>
              If your complaint is about the installation, the products, or the
              service you received from us, please contact us at{" "}
              <a href="mailto:connect@warmlifeltd.co.uk">
                connect@warmlifeltd.co.uk
              </a>
              , on <a href="tel:+447446001690">+44 7446 001690</a>, or by post
              at Registered Office: Suite E, 224 Regency Court, Upper Fifth
              Street, Milton Keynes, United Kingdom, MK9 2HR. We will
              acknowledge your complaint and tell you how we will handle it.
            </p>

            <h2>Complaints relating to Finance</h2>
            <p>
              If your complaint relates to the finance agreement itself,
              including the terms of the agreement, payments, the way the
              finance was explained to you, or the administration of your
              finance agreement, please contact Hometree Finance, a trading name
              of HTG Finance Limited, directly at{" "}
              <a href="mailto:hello@hometreefinance.co.uk">
                hello@hometreefinance.co.uk
              </a>
              .
            </p>

            <p>
              If you are unhappy with the outcome of your complaint, or you have
              not received a final response within eight weeks, you may be able
              to refer your complaint to the Financial Ombudsman Service (FOS).
              The service is free and independent.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}