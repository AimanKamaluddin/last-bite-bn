import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { sampleListings, formatBND } from "@/lib/sample-data";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Clock, MapPin, Star, AlertTriangle } from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";
import { toast } from "sonner";

export const Route = createFileRoute("/listing/$id")({
  component: ListingDetail,
});

function ListingDetail() {
  const { id } = Route.useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const local = sampleListings.find((l) => l.id === id);
      if (local) {
        setData(local);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("listings")
        .select("*, merchants(*)")
        .eq("id", id)
        .maybeSingle();
      if (data) {
        setData({
          ...data,
          merchant: {
            business_name: data.merchants.business_name,
            district: data.merchants.district,
            address: data.merchants.address,
            rating: Number(data.merchants.rating ?? 0),
            business_type: data.merchants.business_type,
            phone: data.merchants.phone,
            email: data.merchants.email,
          },
        });
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return <SiteLayout><div className="container mx-auto p-10">Loading…</div></SiteLayout>;
  }
  if (!data) {
    return (
      <SiteLayout>
        <div className="container mx-auto p-10 text-center">
          <h1 className="text-2xl font-bold">Listing not found</h1>
          <Button asChild className="mt-4 rounded-full"><Link to="/browse">Back to browse</Link></Button>
        </div>
      </SiteLayout>
    );
  }

  const soldOut = data.quantity_available <= 0;

  const reserve = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to reserve.");
      navigate({ to: "/auth", search: { redirect: `/listing/${id}` } });
      return;
    }
    navigate({ to: "/checkout/$id", params: { id } });
  };

  return (
    <SiteLayout>
      <section className="container mx-auto grid gap-10 px-4 py-10 md:grid-cols-[1.2fr_1fr]">
        <div>
          <img src={data.image_url} alt={data.title} className="aspect-[4/3] w-full rounded-3xl object-cover" />
          <h1 className="mt-6 text-3xl font-bold md:text-4xl">{data.title}</h1>
          <p className="mt-1 text-muted-foreground">
            {data.merchant.business_name} · {data.merchant.district}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary" className="rounded-full">{data.category}</Badge>
            <Badge variant="secondary" className="rounded-full">
              <Star className="mr-1 h-3 w-3 fill-sun text-sun" /> {data.merchant.rating?.toFixed(1) ?? "—"}
            </Badge>
          </div>

          <h2 className="mt-8 text-lg font-semibold">About this bag</h2>
          <p className="mt-2 text-sm text-muted-foreground">{data.description}</p>

          <h2 className="mt-8 text-lg font-semibold">What to expect</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A surprise selection of unsold items, packed fresh by the merchant. Exact contents vary based on what's available.
          </p>

          <h2 className="mt-8 text-lg font-semibold">Allergen info</h2>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-accent" />{data.allergen_info || "Ask the merchant for allergen details."}</li>
          </ul>

          <h2 className="mt-8 text-lg font-semibold">Pickup location</h2>
          <Card className="mt-2 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              {data.merchant.address || `${data.merchant.business_name}, ${data.merchant.district}`}
            </div>
            <div className="mt-3 grid h-40 place-items-center rounded-xl bg-muted text-xs text-muted-foreground">
              Map preview (coming soon)
            </div>
          </Card>
        </div>

        <aside>
          <Card className="sticky top-24 rounded-3xl p-6">
            <div className="text-sm text-muted-foreground line-through">{formatBND(Number(data.original_price))}</div>
            <div className="text-4xl font-bold text-primary">{formatBND(Number(data.discounted_price))}</div>
            <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" /> {formatTime(data.pickup_start)} – {formatTime(data.pickup_end)}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{data.quantity_available} bags left</div>

            <Button className="mt-5 w-full rounded-full" size="lg" onClick={reserve} disabled={soldOut}>
              {soldOut ? "Sold out" : "Reserve now"}
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              Merchant contact details are shared after your reservation is confirmed.
            </p>
            </Card>
          </aside>
        </section>

        <section className="container mx-auto px-4 pb-10">
          <AdSlot size="leaderboard" id="listing-bottom" label="Sponsored" />
        </section>
    </SiteLayout>
  );
}

function formatTime(t: string) {
  if (!t) return "";
  if (t.length <= 5) return t;
  try { return new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); } catch { return t; }
}
