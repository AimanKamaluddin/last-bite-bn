import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listings/ListingCard";

const isExpired = (pickupEnd: string) => {
  const end = new Date(pickupEnd);
  return !Number.isNaN(end.getTime()) && end.getTime() < Date.now();
};

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="container mx-auto px-4 py-14 md:py-20">
      <div className="mb-8 max-w-2xl">
        <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
        {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

export function HomeOfferSections({ listings }: { listings: any[] }) {
  const offersToday = listings.filter((l) => !isExpired(l.pickup_end)).slice(0, 6);
  const pastOffers = listings.filter((l) => isExpired(l.pickup_end)).slice(0, 6);

  return (
    <>
      {offersToday.length > 0 && (
        <Section title="Offers today" subtitle="Fresh offers still available for pickup today.">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {offersToday.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
          <div className="mt-8 text-center">
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link to="/browse">See all food</Link>
            </Button>
          </div>
        </Section>
      )}

      {pastOffers.length > 0 && (
        <Section title="Past offers" subtitle="These pickup windows have ended. Check back for relisted items soon.">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pastOffers.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </Section>
      )}
    </>
  );
}
