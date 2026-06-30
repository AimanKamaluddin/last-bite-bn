import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

const sections = [
  ["1. Acceptance of Terms", "By accessing, browsing, creating an account, placing an order, applying as a merchant, or otherwise using Last Bite, you agree to be bound by these Terms & Conditions, the Privacy Policy, the Food Safety & Community Guidelines, and any additional rules shown during checkout or onboarding. If you do not agree, you must not use the platform."],
  ["2. Platform Role", "Last Bite is a technology marketplace that connects customers with independent food vendors. Last Bite is not the restaurant, bakery, caterer, manufacturer, packer, handler, or seller of the food unless expressly stated. The food sale is between the customer and the vendor."],
  ["3. Eligibility and Account Accuracy", "You must be legally capable of using the service and must provide accurate, current and complete information. You are responsible for all activity under your account and for keeping your login credentials secure."],
  ["4. Nature of Surplus Food", "Customers acknowledge that items may be surplus, end-of-day, limited quantity, discounted, imperfect in appearance, or close to a pickup or consumption window. Photos, descriptions and quantities may be indicative and can vary reasonably from the final product."],
  ["5. Orders and Pickup", "An order becomes binding once confirmed. Customers must collect orders within the stated pickup window and show any required confirmation. Failure to collect on time may result in forfeiture without refund, except where required by law or expressly approved by Last Bite or the vendor."],
  ["6. Prices, Fees and Payments", "Prices are set by vendors unless stated otherwise. Last Bite may charge service fees or commissions. All prices are shown in BND unless otherwise indicated. Payments may be handled by third-party payment providers and are subject to their terms."],
  ["7. Refunds and Cancellations", "Refunds may be considered where an order cannot be fulfilled, the wrong item is supplied, duplicate payment occurs, or there is a verified safety issue. Refunds are generally not available for change of mind, late pickup, taste preference, failure to read listing details, or customer error."],
  ["8. Allergens and Dietary Requirements", "Customers are responsible for checking ingredients, allergens and dietary suitability with the vendor before purchase or consumption. Last Bite does not independently verify allergen statements and is not liable for allergic reactions to the maximum extent permitted by law."],
  ["9. Prohibited Conduct", "Users must not commit fraud, abuse vendors or customers, harass others, upload unlawful content, manipulate reviews, misuse promotions, scrape or attack the platform, impersonate others, or use the platform for illegal or unsafe activity."],
  ["10. Reviews and Content", "User reviews and content must be truthful, relevant, respectful and lawful. Last Bite may moderate, remove or restrict content that appears false, abusive, discriminatory, unsafe, irrelevant or otherwise harmful."],
  ["11. Intellectual Property", "Last Bite owns or licenses the platform, branding, software, design, logos, text and content. Users receive only a limited, revocable, non-transferable licence to use the service for its intended purpose."],
  ["12. Suspension and Termination", "Last Bite may suspend, restrict or terminate accounts, listings, orders or access where we reasonably believe there is breach, fraud, abuse, safety risk, legal risk, non-payment, misuse, or harm to the platform community."],
  ["13. Disclaimers", "The platform is provided on an as-is and as-available basis. Last Bite does not guarantee uninterrupted operation, error-free service, continuous availability of listings, exact product availability, or vendor performance."],
  ["14. Limitation of Liability", "To the maximum extent permitted by applicable law, Last Bite is not liable for indirect, incidental, special, consequential or punitive losses, lost profits, allergic reactions, vendor negligence, food handling after pickup, missed pickup, customer misuse, or events outside our reasonable control."],
  ["15. Indemnity", "You agree to indemnify Last Bite, its owners, officers, employees, contractors and partners against claims, losses, liabilities, damages, costs and expenses arising from your breach of these Terms, misuse of the platform, unlawful conduct, or content you provide."],
  ["16. Changes", "We may update these Terms from time to time. Continued use after changes take effect means you accept the updated Terms. Material changes may be highlighted where reasonably practical."],
  ["17. Governing Law", "These Terms are governed by the laws of Brunei Darussalam. Disputes are subject to the courts of Brunei Darussalam unless mandatory applicable law provides otherwise."],
];

export const Route = createFileRoute("/legal/terms")({
  head: () => ({ meta: [{ title: "Terms & Conditions — Last Bite" }] }),
  component: () => (
    <SiteLayout>
      <article className="container mx-auto max-w-4xl px-4 py-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Version 1.0 · Effective 28 June 2026</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Last Bite Terms & Conditions</h1>
        <div className="mt-8 space-y-7">
          {sections.map(([title, body]) => <section key={title}><h2 className="text-xl font-bold">{title}</h2><p className="mt-2 leading-7 text-muted-foreground">{body}</p></section>)}
        </div>
        <div className="mt-10 rounded-3xl border p-5 text-sm text-muted-foreground">
          Also read the <Link to="/legal/privacy" className="font-semibold text-primary underline">Privacy Policy</Link>, <Link to="/legal/food-safety" className="font-semibold text-primary underline">Food Safety & Community Guidelines</Link>, and <Link to="/legal/merchant-agreement" className="font-semibold text-primary underline">Merchant Agreement</Link>.
        </div>
      </article>
    </SiteLayout>
  ),
});