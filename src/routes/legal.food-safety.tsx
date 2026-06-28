import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

const sections = [
  ["1. Vendor Food Safety Duties", "Vendors are solely responsible for food sourcing, preparation, cooking, cooling, storage, packaging, labelling, temperature control, hygiene, allergen information, pickup handover and compliance with applicable food safety rules."],
  ["2. No Unsafe Listings", "Vendors must not list food that is unsafe, contaminated, expired, unlawfully supplied, improperly stored, mislabelled, subject to recall, or otherwise unsuitable for consumption."],
  ["3. Allergens and Dietary Information", "Vendors should provide accurate allergen and dietary information where known. Customers with allergies or dietary restrictions must confirm suitability directly with the vendor before consuming food."],
  ["4. Customer Pickup Duties", "Customers must collect orders within the stated pickup window, check the order before leaving where practical, store food appropriately after pickup, and consume it within a reasonable time or in accordance with vendor instructions."],
  ["5. Marketplace Disclaimer", "Last Bite does not prepare, inspect, package, transport or independently verify food. Last Bite may remove listings or vendors where safety concerns arise, but vendor responsibility remains unchanged."],
  ["6. Respectful Conduct", "Customers and vendors must communicate respectfully. Harassment, threats, discrimination, abusive language, fraud, intimidation, fake reviews or unsafe conduct may result in account suspension."],
  ["7. Reporting Safety Issues", "If you believe food is unsafe, do not consume it. Take photos where possible, keep order details, contact the vendor promptly and report the matter to Last Bite support."],
  ["8. Platform Action", "Last Bite may investigate reports, request evidence, remove listings, issue refunds, restrict accounts, suspend vendors, or cooperate with authorities where safety, fraud or legal concerns arise."],
];

export const Route = createFileRoute("/legal/food-safety")({
  head: () => ({ meta: [{ title: "Food Safety & Community Guidelines — Last Bite" }] }),
  component: () => (
    <SiteLayout>
      <article className="container mx-auto max-w-4xl px-4 py-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Version 1.0 · Effective 28 June 2026</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Food Safety & Community Guidelines</h1>
        <p className="mt-4 rounded-2xl border bg-muted/40 p-4 text-sm leading-6 text-muted-foreground">These guidelines help protect customers, vendors and the Last Bite community. They do not replace laws, regulations, licences or professional food safety obligations.</p>
        <div className="mt-8 space-y-7">
          {sections.map(([title, body]) => <section key={title}><h2 className="text-xl font-bold">{title}</h2><p className="mt-2 leading-7 text-muted-foreground">{body}</p></section>)}
        </div>
        <div className="mt-10 rounded-3xl border p-5 text-sm text-muted-foreground">
          These guidelines form part of the <Link to="/legal/terms" className="font-semibold text-primary underline">Terms & Conditions</Link> and <Link to="/legal/merchant-agreement" className="font-semibold text-primary underline">Merchant Agreement</Link>.
        </div>
      </article>
    </SiteLayout>
  ),
});
