import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/legal/food-safety")({
  head: () => ({ meta: [{ title: "Food Safety Disclaimer — Last Bite" }] }),
  component: () => (
    <SiteLayout>
      <article className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold">Food Safety Disclaimer</h1>
        <p className="mt-4 text-muted-foreground">
          Merchants are solely responsible for the quality, preparation, allergen accuracy, and safe handling of the food listed on Last Bite.
        </p>
        <p className="mt-3 text-muted-foreground">
          Customers are responsible for collecting their food within the pickup window and consuming it within a reasonable time frame. If you have specific dietary or allergy concerns, please confirm with the merchant before consumption.
        </p>
        <p className="mt-3 text-muted-foreground">Last Bite acts as a platform connecting customers and merchants and does not handle or prepare food.</p>
      </article>
    </SiteLayout>
  ),
});
