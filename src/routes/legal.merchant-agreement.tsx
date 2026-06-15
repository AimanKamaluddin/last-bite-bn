import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/legal/merchant-agreement")({
  head: () => ({ meta: [{ title: "Merchant Agreement — Last Bite" }] }),
  component: () => (
    <SiteLayout>
      <article className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold">Merchant Agreement</h1>
        <p className="mt-4 text-muted-foreground">By joining Last Bite as a merchant, you agree to:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>List only food that is safe and within consumption windows.</li>
          <li>Provide accurate allergen and halal information for each listing.</li>
          <li>Honour reservations within your stated pickup window.</li>
          <li>Pay Last Bite a 15% commission on successful orders.</li>
          <li>Maintain a respectful, professional relationship with customers.</li>
        </ul>
        <p className="mt-4 text-muted-foreground">Last Bite reserves the right to suspend merchants who repeatedly violate these terms.</p>
      </article>
    </SiteLayout>
  ),
});
