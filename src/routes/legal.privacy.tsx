import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

const sections = [
  ["1. Information We Collect", "We may collect account details, name, email, phone number, username, order history, pickup details, merchant business details, uploaded images, support messages, device data, logs, approximate location where enabled, and payment status information from payment providers."],
  ["2. How We Use Information", "We use information to create accounts, process orders, connect customers and vendors, provide support, prevent fraud, improve the platform, enforce agreements, comply with legal obligations, and communicate important service updates."],
  ["3. Payments", "Payments may be processed by third-party payment providers. Last Bite does not intentionally store full payment card details. Payment providers may collect and process information under their own terms and privacy policies."],
  ["4. Vendors and Customer Data", "Vendors may receive limited customer and order information necessary to fulfil orders. Vendors must use that information only for fulfilment, support and lawful recordkeeping."],
  ["5. Sharing", "We may share information with vendors, payment providers, hosting providers, analytics and security services, professional advisers, regulators, law enforcement, or parties involved in a business transfer where reasonably necessary and lawful."],
  ["6. Data Retention", "We keep information for as long as necessary to operate the service, resolve disputes, prevent fraud, comply with law, keep financial records, and enforce our agreements. Retention periods may vary by data type."],
  ["7. Security", "We use reasonable technical and organisational measures to protect information. No online system is completely secure, and users are responsible for keeping passwords and devices safe."],
  ["8. User Choices", "You may update account details where the platform allows, request support, unsubscribe from non-essential communications, and request access, correction or deletion where applicable law provides such rights."],
  ["9. International Services", "Some service providers may process data outside Brunei Darussalam. By using Last Bite, you acknowledge that data may be transferred and processed where our providers operate, subject to appropriate safeguards where required."],
  ["10. Children", "Last Bite is not intended for unsupervised use by children. Parents or guardians are responsible for minors using the platform."],
  ["11. Contact", "For privacy questions or requests, contact lastbite.bn@gmail.com. We may need to verify your identity before responding to certain requests."],
];

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — Last Bite" }] }),
  component: () => (
    <SiteLayout>
      <article className="container mx-auto max-w-4xl px-4 py-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Version 1.0 · Effective 28 June 2026</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Last Bite Privacy Policy</h1>
        <p className="mt-4 rounded-2xl border bg-muted/40 p-4 text-sm leading-6 text-muted-foreground">This policy explains how Last Bite handles personal information for customers, vendors and visitors. Have this reviewed against Brunei privacy and consumer requirements before launch.</p>
        <div className="mt-8 space-y-7">
          {sections.map(([title, body]) => <section key={title}><h2 className="text-xl font-bold">{title}</h2><p className="mt-2 leading-7 text-muted-foreground">{body}</p></section>)}
        </div>
        <div className="mt-10 rounded-3xl border p-5 text-sm text-muted-foreground">
          This policy works together with the <Link to="/legal/terms" className="font-semibold text-primary underline">Terms & Conditions</Link> and <Link to="/legal/merchant-agreement" className="font-semibold text-primary underline">Merchant Agreement</Link>.
        </div>
      </article>
    </SiteLayout>
  ),
});
