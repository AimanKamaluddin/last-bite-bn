import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ListingCard, type ListingCardData } from "@/components/listings/ListingCard";
import { ReviewList } from "@/components/reviews/ReviewList";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { getPublicMerchantProfile } from "@/lib/public-merchant.functions";
import { Clock, Mail, MapPin, MessageCircle, Phone, Star, Store } from "lucide-react";

export const Route = createFileRoute("/merchant-profile/$id")({ component: MerchantProfile });

const isExpired = (pickupEnd: string) => {
  const end = new Date(pickupEnd);
  return !Number.isNaN(end.getTime()) && end.getTime() < Date.now();
};

function MerchantProfile() {
  const { id } = Route.useParams();
  const { isAuthenticated } = useAuth();
  const [merchant, setMerchant] = useState<any>(null);
  const [listings, setListings] = useState<ListingCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadMerchant() {
      setLoading(true);
      let merchantRecord: any = null;

      try {
        merchantRecord = await getPublicMerchantProfile({ data: { id } });
      } catch (error) {
        console.error("Merchant profile lookup failed", error);
      }

      const { data: listingRows, error: listingsError } = await (supabase as any)
        .from("listings")
        .select("*")
        .eq("merchant_id", id)
        .eq("visible", true)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (listingsError) console.error("Merchant listings lookup failed", listingsError);
      if (cancelled) return;

      setMerchant(merchantRecord);
      setListings((listingRows ?? []).map((row: any) => ({
        id: row.id,
        title: row.title,
        category: row.category,
        original_price: Number(row.original_price),
        discounted_price: Number(row.discounted_price),
        quantity_available: row.quantity_available,
        pickup_start: row.pickup_start,
        pickup_end: row.pickup_end,
        created_at: row.created_at,
        produced_at: row.produced_at,
        image_url: row.image_url || "",
        merchant: {
          business_name: merchantRecord?.business_name ?? "",
          district: merchantRecord?.district ?? "",
          rating: Number(merchantRecord?.rating ?? 0),
          image_url: merchantRecord?.image_url ?? null,
        },
      })));
      setLoading(false);
    }

    loadMerchant();
    return () => { cancelled = true; };
  }, [id]);

  const offersToday = useMemo(() => listings.filter((l) => !isExpired(l.pickup_end)), [listings]);
  const pastOffers = useMemo(() => listings.filter((l) => isExpired(l.pickup_end)), [listings]);

  if (loading) return <SiteLayout><div className="container mx-auto p-10">Loading merchant profile…</div></SiteLayout>;
  if (!merchant) return <SiteLayout><div className="container mx-auto p-10 text-center"><h1 className="text-2xl font-bold">Merchant not found</h1><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">This merchant profile may no longer be public, or the link may be out of date.</p><Button asChild className="mt-4 rounded-full"><Link to="/">Back home</Link></Button></div></SiteLayout>;

  return (
    <SiteLayout>
      <section className="container mx-auto max-w-6xl px-4 py-10">
        <Card className="overflow-hidden rounded-3xl p-0">
          <div className="h-52 bg-gradient-to-br from-primary via-emerald-600 to-accent md:h-64">
            {(merchant.cover_image_url || merchant.image_url) && <img src={merchant.cover_image_url || merchant.image_url} alt={merchant.business_name} className="h-full w-full object-cover" />}
          </div>
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="-mt-16 mb-4 grid h-24 w-24 place-items-center overflow-hidden rounded-3xl bg-primary text-primary-foreground shadow-lg ring-4 ring-background">
                  {merchant.image_url ? <img src={merchant.image_url} alt={merchant.business_name} className="h-full w-full object-cover" /> : <Store className="h-10 w-10" />}
                </div>
                <h1 className="text-3xl font-bold md:text-4xl">{merchant.business_name}</h1>
                {merchant.tagline && <p className="mt-2 max-w-2xl text-lg text-muted-foreground">{merchant.tagline}</p>}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  {merchant.business_type && <Badge variant="secondary" className="rounded-full">{merchant.business_type}</Badge>}
                  <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{merchant.district}</span>
                  <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 fill-sun text-sun" />{Number(merchant.rating ?? 0).toFixed(1)}</span>
                </div>
              </div>
              <div className="grid gap-2 sm:flex sm:items-center">
                <Button asChild variant="outline" className="rounded-full">
                  {isAuthenticated ? <Link to="/messages" search={{ merchant_id: merchant.id }}><MessageCircle className="mr-2 h-4 w-4" />Message vendor</Link> : <Link to="/auth" search={{ redirect: `/messages?merchant_id=${merchant.id}` }}><MessageCircle className="mr-2 h-4 w-4" />Message vendor</Link>}
                </Button>
                <Button asChild className="rounded-full"><Link to="/browse">Browse all food</Link></Button>
              </div>
            </div>

            {(merchant.description || merchant.address || merchant.opening_hours || merchant.phone || merchant.email) && (
              <div className="mt-8 grid gap-4 md:grid-cols-[1.4fr_1fr]">
                {merchant.description && <Card className="rounded-2xl p-4"><h2 className="font-semibold">About</h2><p className="mt-2 text-sm text-muted-foreground">{merchant.description}</p></Card>}
                <Card className="rounded-2xl p-4">
                  <h2 className="font-semibold">Business details</h2>
                  <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                    {merchant.address && <span className="inline-flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" />{merchant.address}</span>}
                    {merchant.opening_hours && <span className="inline-flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 text-primary" />{merchant.opening_hours}</span>}
                    {merchant.phone && <span className="inline-flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-primary" />{merchant.phone}</span>}
                    {merchant.email && <span className="inline-flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-primary" />{merchant.email}</span>}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </Card>

        <section className="mt-10">
          <div className="mb-4 flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /><h2 className="text-2xl font-bold">Offers today</h2></div>
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

function EmptyCard({ msg }: { msg: string }) { return <Card className="mt-4 rounded-3xl p-8 text-center text-muted-foreground">{msg}</Card>; }