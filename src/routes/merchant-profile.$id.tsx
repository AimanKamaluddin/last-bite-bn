import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ListingCard, type ListingCardData } from "@/components/listings/ListingCard";
import { ReviewList } from "@/components/reviews/ReviewList";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Star, Store, Clock } from "lucide-react";

export const Route = createFileRoute("/merchant-profile/$id")({ component: MerchantProfile });

const isExpired = (pickupEnd: string) => {
  const end = new Date(pickupEnd);
  return !Number.isNaN(end.getTime()) && end.getTime() < Date.now();
};

function MerchantProfile() {
  const { id } = Route.useParams();
  const [merchant, setMerchant] = useState<any>(null);
  const [listings, setListings] = useState<ListingCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [{ data: m }, { data: l }] = await Promise.all([
        (supabase as any)
          .from("merchants_public")
          .select("id, business_name, business_type, district, image_url, rating")
          .eq("id", id)
          .maybeSingle(),
        (supabase as any)
          .from("listings")
          .select("*")
          .eq("merchant_id", id)
          .eq("visible", true)
          .eq("status", "active")
          .order("created_at", { ascending: false }),
      ]);
      if (cancelled) return;
      setMerchant(m);
      setListings((l ?? []).map((d: any) => ({
        id: d.id,
        title: d.title,
        category: d.category,
        original_price: Number(d.original_price),
        discounted_price: Number(d.discounted_price),
        quantity_available: d.quantity_available,
        pickup_start: d.pickup_start,
        pickup_end: d.pickup_end,
        created_at: d.created_at,
        produced_at: d.produced_at,
        image_url: d.image_url || "",
        merchant: {
          business_name: m?.business_name ?? "",
          district: m?.district ?? "",
          rating: Number(m?.rating ?? 0),
        },
      })));
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [id]);

  const offersToday = useMemo(() => listings.filter((l) => !isExpired(l.pickup_end)), [listings]);
  const pastOffers = useMemo(() => listings.filter((l) => isExpired(l.pickup_end)), [listings]);

  if (loading) return <SiteLayout><div className="container mx-auto p-10">Loading merchant profile…</div></SiteLayout>;
  if (!merchant) return <SiteLayout><div className="container mx-auto p-10 text-center"><h1 className="text-2xl font-bold">Merchant not found</h1><Button asChild className="mt-4 rounded-full"><Link to="/">Back home</Link></Button></div></SiteLayout>;

  return (
    <SiteLayout>
      <section className="container mx-auto max-w-6xl px-4 py-10">
        <Card className="overflow-hidden rounded-3xl p-0">
          <div className="h-44 bg-gradient-to-br from-primary via-emerald-600 to-accent">
            {merchant.image_url && <img src={merchant.image_url} alt={merchant.business_name} className="h-full w-full object-cover opacity-90" />}
          </div>
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-3 grid h-16 w-16 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                  <Store className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-bold md:text-4xl">{merchant.business_name}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  {merchant.business_type && <Badge variant="secondary" className="rounded-full">{merchant.business_type}</Badge>}
                  <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{merchant.district}</span>
                  <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 fill-sun text-sun" />{Number(merchant.rating ?? 0).toFixed(1)}</span>
                </div>
              </div>
              <Button asChild className="rounded-full"><Link to="/browse">Browse all food</Link></Button>
            </div>
          </div>
        </Card>

        <section className="mt-10">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Offers today</h2>
          </div>
          {offersToday.length === 0 ? <EmptyCard msg="This merchant has no current offers available right now." /> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{offersToday.map((l) => <ListingCard key={l.id} listing={l} />)}</div>}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">Past offers</h2>
          <p className="mt-1 text-sm text-muted-foreground">Previous offers whose pickup windows have ended.</p>
          {pastOffers.length === 0 ? <EmptyCard msg="No past offers yet." /> : <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{pastOffers.map((l) => <ListingCard key={l.id} listing={l} />)}</div>}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">Customer reviews</h2>
          <ReviewList merchantId={merchant.id} />
        </section>
      </section>
    </SiteLayout>
  );
}

function EmptyCard({ msg }: { msg: string }) {
  return <Card className="mt-4 rounded-3xl p-8 text-center text-muted-foreground">{msg}</Card>;
}
