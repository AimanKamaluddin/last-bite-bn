import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

const sections = [
  ["1. Vendor Status", "By applying to sell on Last Bite, you confirm that you are an independent vendor and not an employee, agent, partner or representative of Last Bite. You remain solely responsible for your business, staff, premises, food, permits, taxes and legal compliance."],
  ["2. Licensing and Legal Compliance", "You certify that your business holds and will maintain all registrations, approvals, permits, food handling permissions, halal-related approvals where applicable, tax registrations and other permissions required to lawfully prepare, advertise and sell food in Brunei Darussalam."],
  ["3. Food Safety Responsibility", "You are solely responsible for food quality, preparation, storage, temperature control, hygiene, packaging, labelling, allergen accuracy, shelf-life, pickup readiness and safe handover. You must not list unsafe, contaminated, expired, mislabelled or unlawfully supplied food."],
  ["4. Accurate Listings", "Listings must be truthful and not misleading. You must accurately describe the item, quantity, pickup window, price, discount, category, dietary or allergen information where known, photos and any important limitations."],
  ["5. Order Fulfilment", "You must honour confirmed orders and make them available during the stated pickup window. Repeated cancellations, no-shows, inaccurate quantities or failure to fulfil may result in delisting, suspension or permanent removal."],
  ["6. Pricing and Commission", "You control your listing prices unless otherwise agreed. Last Bite may charge a commission or service fee on successful orders. Fee rates may be displayed in the app, onboarding materials or separate commercial terms."],
  ["7. Customer Data", "Customer information may only be used to fulfil Last Bite orders, resolve support matters and comply with law. You must not misuse, sell, disclose, spam, scrape or retain customer data beyond legitimate business need."],
  ["8. Complaints, Refunds and Investigations", "Last Bite may investigate complaints, request evidence, contact customers, issue refunds, remove listings, withhold access, or suspend accounts where there is a safety, fraud, quality or fulfilment concern."],
  ["9. Inspections and Documentation", "Upon request, you agree to provide reasonable documentation supporting business identity, registration, authorisation, food safety procedures, menu information, allergen information and order fulfilment."],
  ["10. Prohibited Vendor Conduct", "Vendors must not list illegal or unsafe products, misrepresent discounts, inflate original prices, manipulate ratings, contact customers for improper purposes, bypass Last Bite fees, discriminate, harass, or damage the platform."],
  ["11. Indemnity", "You agree to indemnify Last Bite against claims, losses, fines, liabilities, costs and expenses arising from your food, premises, staff, listings, breach of this Agreement, regulatory non-compliance, customer claims, or unsafe handling."],
  ["12. Suspension and Termination", "Last Bite may approve, reject, suspend, restrict, remove or terminate vendor access at its discretion where reasonably necessary to protect customers, legal compliance, platform integrity or Last Bite’s reputation."],
  ["13. Governing Law", "This Agreement is governed by the laws of Brunei Darussalam and disputes are subject to the courts of Brunei Darussalam unless mandatory law provides otherwise."],
];

export const Route = createFileRoute("/legal/merchant-agreement")({
  head: () => ({ meta: [{ title: "Merchant Agreement — Last Bite" }] }),
  component: () => (
    <SiteLayout>
      <article className="container mx-auto max-w-4xl px-4 py-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Version 1.0 · Effective 28 June 2026</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Last Bite Merchant Agreement</h1>
        <p className="mt-4 rounded-2xl border bg-muted/40 p-4 text-sm leading-6 text-muted-foreground">This agreement applies in addition to the general Terms & Conditions. It is designed for food vendors using Last Bite to list and sell surplus food.</p>
        <div className="mt-8 space-y-7">
          {sections.map(([title, body]) => <section key={title}><h2 className="text-xl font-bold">{title}</h2><p className="mt-2 leading-7 text-muted-foreground">{body}</p></section>)}
        </div>
        <div className="mt-10 rounded-3xl border p-5 text-sm text-muted-foreground">
          Vendors must also comply with the <Link to="/legal/terms" className="font-semibold text-primary underline">Terms & Conditions</Link>, <Link to="/legal/privacy" className="font-semibold text-primary underline">Privacy Policy</Link>, and <Link to="/legal/food-safety" className="font-semibold text-primary underline">Food Safety & Community Guidelines</Link>.
        </div>
      </article>
    </SiteLayout>
  ),
});
