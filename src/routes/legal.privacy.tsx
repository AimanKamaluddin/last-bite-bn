import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — Last Bite" }] }),
  component: () => (
    <SiteLayout>
      <article className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground">We collect the minimum information required to operate the marketplace: your name, email, phone, and order history. We do not sell personal data.</p>
        <h2 className="mt-6 text-xl font-semibold">What we collect</h2>
        <p className="mt-2 text-muted-foreground">Account details, reservation history, merchant business information, and basic analytics.</p>
        <h2 className="mt-6 text-xl font-semibold">Contact</h2>
        <p className="mt-2 text-muted-foreground">For privacy questions, reach us at privacy@lastbite.bn.</p>
      </article>
    </SiteLayout>
  ),
});
