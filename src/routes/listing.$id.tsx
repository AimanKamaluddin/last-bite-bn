import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { sampleListings, formatBND, type SampleListing } from "@/lib/sample-data";
import { ListingCard, type ListingCardData } from "@/components/listings/ListingCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Clock, MapPin, Star, AlertTriangle, CalendarDays } from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";
import { toast } from "sonner";

export const Route = createFileRoute("/listing/$id")({ component: ListingDetail });

const isPastPickup = (pickupEnd: string) => {
  const end = new Date(pickupEnd);
  return !Number.isNaN(end.getTime()) && end.getTime() < Date.now();
};
const formatDateWithDay = (iso?: string | null) => {
  if (!iso) return "";
  try { return new Date(iso).toLocaleDateString([], { weekday: "long", year: "numeric", month: "short", day: "numeric" }); } catch { return ""; }
};
const formatDateTime = (iso?: string | null) => {
  if (!iso) return "";
  try { return new Date(iso).toLocaleString([], { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }); } catch { return ""; }
};

function ListingDetail() {
  const { id } = Route.useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<ListingCardData[]>([]);

  useEffect(() => {
    (async () => {
      const local = sampleListings.find((l) => l.id === id);
      if (local) {
        setData(local);
        setRelated(sampleListings.filter((l) => l.merchant.id === local.merchant.id && l.id !== local.id).map((l) => toCardData(l)));
        setLoading(false);
        return;
      }
      const { data } = await (supabase as any).from("listings").select("*").eq("id", id).maybeSingle();
      if (data) {
        const { data: m } = await (supabase as any).from("merchants_public").select("business_name, district, rating, business_type").eq("id", data.merchant_id).maybeSingle();
        setData({ ...data, merchant: { business_name: m?.business_name ?? "", district: m?.district ?? "", address: "", rating: Number(m?.rating ?? 0), business_type: m?.business_type ?? "" } });
        const { data: others } = await (supabase as any).from("listings").select("*").eq("merchant_id", data.merchant_id).eq("status", "active").neq("id", id).gt("quantity_available", 0).limit(6);
        if (others && m) {
          setRelated(others.map((o: any) => ({ id: o.id, title: o.title, image_url: o.image_url, category: o.category, original_price: Number(o.original_price), discounted_price: Number(o.discounted_price), quantity_available: o.quantity_available, pickup_start: o.pickup_start, pickup_end: o.pickup_end, created_at: o.created_at, produced_at: o.produced_at, merchant: { business_name: m.business_name ?? "", district: m.district ?? "", rating: Number(m.rating ?? 0) } })));
        }
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <SiteLayout><div className="container mx-auto p-10">Loading…</div></SiteLayout>;
  if (!data) return <SiteLayout><div className="container mx-auto p-10 text-center"><h1 className="text-2xl font-bold">Listing not found</h1><Button asChild className="mt-4 rounded-full"><Link to="/browse">Back to browse</Link></Button></div></SiteLayout>;

  const soldOut = data.quantity_available <= 0;
  const expired = isPastPickup(data.pickup_end);
  const unavailable = soldOut || expired;

  const reserve = () => {
    if (expired) { toast.error("This offer has expired."); return; }
    if (!isAuthenticated) { toast.info("Please sign in to reserve."); navigate({ to: "/auth", search: { redirect: `/listing/${id}` } }); return; }
    navigate({ to: "/checkout/$id", params: { id } });
  };

  return (
    <SiteLayout>
      <section className="container mx-auto grid gap-10 px-4 py-10 md:grid-cols-[1.2fr_1fr]">
        <div>
          <img src={data.image_url} alt={data.title} className="aspect-[4/3] w-full rounded-3xl object-cover" />
          {Array.isArray((data as any).images) && (data as any).images.length > 1 && <div className="mt-3 grid grid-cols-4 gap-2">{((data as any).images as string[]).slice(0, 8).map((u, i) => <img key={i} src={u} alt="" className="aspect-square w-full rounded-xl object-cover" />)}</div>}
          <h1 className="mt-6 text-3xl font-bold md:text-4xl">{data.title}</h1>
          <p className="mt-1 text-muted-foreground">{data.merchant.business_name} · {data.merchant.district}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary" className="rounded-full">{data.category}</Badge>
            <Badge variant="secondary" className="rounded-full"><Star className="mr-1 h-3 w-3 fill-sun text-sun" /> {data.merchant.rating?.toFixed(1) ?? "—"}</Badge>
            {expired && <Badge variant="outline" className="rounded-full">Offer expired</Badge>}
          </div>

          <h2 className="mt-8 text-lg font-semibold">About this bag</h2>
          <p className="mt-2 text-sm text-muted-foreground">{data.description}</p>

          <Card className="mt-8 rounded-2xl p-4">
            <h2 className="text-lg font-semibold">Listing details</h2>
            <div className="mt-3 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              <div className="flex items-start gap-2"><CalendarDays className="mt-0.5 h-4 w-4 text-primary" /><span><strong className="text-foreground">Listed:</strong><br />{formatDateWithDay(data.created_at)}</span></div>
              <div className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 text-primary" /><span><strong className="text-foreground">Produced:</strong><br />{formatDateTime(data.produced_at) || "Not provided"}</span></div>
            </div>
          </Card>

          <h2 className="mt-8 text-lg font-semibold">Allergen info</h2>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground"><li className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-accent" />{data.allergen_info || "Ask the merchant for allergen details."}</li></ul>

          <h2 className="mt-8 text-lg font-semibold">Pickup location</h2>
          <Card className="mt-2 rounded-2xl p-4"><div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-primary" />{data.merchant.address || `${data.merchant.business_name}, ${data.merchant.district}`}</div><div className="mt-3 grid h-40 place-items-center rounded-xl bg-muted text-xs text-muted-foreground">Map preview (coming soon)</div></Card>
        </div>

        <aside>
          <Card className="sticky top-24 rounded-3xl p-6">
            <div className="text-sm text-muted-foreground line-through">{formatBND(Number(data.original_price))}</div>
            <div className="text-4xl font-bold text-primary">{formatBND(Number(data.discounted_price))}</div>
            <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground"><Clock className="h-4 w-4" /> {formatTime(data.pickup_start)} – {formatTime(data.pickup_end)}</div>
            <div className="mt-1 text-sm text-muted-foreground">{expired ? "Pickup window has ended" : `${data.quantity_available} bags left`}</div>
            <Button className="mt-5 w-full rounded-full" size="lg" onClick={reserve} disabled={unavailable}>{expired ? "Offer expired" : soldOut ? "Sold out" : "Reserve now"}</Button>
            <p className="mt-3 text-xs text-muted-foreground">Merchant contact details are shared after your reservation is confirmed.</p>
          </Card>
        </aside>
      </section>

      {related.length > 0 && <section className="container mx-auto px-4 pb-10"><div className="mb-4 flex items-end justify-between"><h2 className="text-2xl font-bold">More from {data.merchant.business_name}</h2><Link to="/browse" className="text-sm text-primary hover:underline">Browse all →</Link></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{related.map((l) => <ListingCard key={l.id} listing={l} />)}</div></section>}
      <section className="container mx-auto px-4 pb-10"><AdSlot size="leaderboard" id="listing-bottom" label="Sponsored" /></section>
    </SiteLayout>
  );
}

function formatTime(t: string) {
  if (!t) return "";
  if (t.length <= 5) return t;
  try { return new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); } catch { return t; }
}

function toCardData(l: SampleListing): ListingCardData {
  return { id: l.id, title: l.title, image_url: l.image_url, category: l.category, original_price: l.original_price, discounted_price: l.discounted_price, quantity_available: l.quantity_available, pickup_start: l.pickup_start, pickup_end: l.pickup_end, merchant: { business_name: l.merchant.business_name, district: l.merchant.district, rating: l.merchant.rating } };
}
