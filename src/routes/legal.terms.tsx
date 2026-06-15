import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({ meta: [{ title: "Terms & Conditions — Last Bite" }] }),
  component: () => (
    <SiteLayout>
      <article className="prose container mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold">Terms & Conditions</h1>
        <p className="mt-4 text-muted-foreground">
          By using Last Bite you agree to use the platform for the purpose of discovering, reserving and collecting surplus food from participating merchants in Brunei Darussalam.
        </p>
        <h2 className="mt-6 text-xl font-semibold">Reservations</h2>
        <p className="mt-2 text-muted-foreground">Reservations are subject to availability. Cancellations are permitted before the merchant-defined cut-off time. After cut-off the order is non-refundable.</p>
        <h2 className="mt-6 text-xl font-semibold">Pickup</h2>
        <p className="mt-2 text-muted-foreground">Customers must collect their order within the pickup window. Uncollected orders may be forfeited at the merchant's discretion.</p>
        <h2 className="mt-6 text-xl font-semibold">Payments</h2>
        <p className="mt-2 text-muted-foreground">Last Bite charges a 15% service commission on each successful order. Prices are shown in Brunei Dollar (BND).</p>
      </article>
    </SiteLayout>
  ),
});
