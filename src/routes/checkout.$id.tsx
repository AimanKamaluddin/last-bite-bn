import { createFileRoute, useNavigate, Navigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { sampleListings, formatBND } from "@/lib/sample-data";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout/$id")({ component: Checkout });

const genCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();
const isPastPickup = (pickupEnd: string) => {
  const end = new Date(pickupEnd);
  return !Number.isNaN(end.getTime()) && end.getTime() < Date.now();
};
const toTimeInput = (value?: string | null) => {
  if (!value) return "";
  if (value.length >= 5 && value[2] === ":") return value.slice(0, 5);
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};
const toMinutes = (value: string) => {
  const parts = value.split(":");
  return Number(parts[0]) * 60 + Number(parts[1]);
};

function Checkout() {
  const { id } = Route.useParams();
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState<any>(null);
  const [listingLoading, setListingLoading] = useState(true);
  const [listingError, setListingError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [placing, setPlacing] = useState(false);
  const [pickupTime, setPickupTime] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setListingLoading(true);
      setListingError(null);
      const local = sampleListings.find((l) => l.id === id);
      if (local) {
        if (!cancelled) { setListing(local); setPickupTime(toTimeInput(local.pickup_start)); setListingLoading(false); }
        return;
      }
      const { data, error } = await (supabase as any).from("listings").select("*").eq("id", id).maybeSingle();
      if (cancelled) return;
      if (error) { setListing(null); setListingError(error.message); setListingLoading(false); return; }
      if (!data) { setListing(null); setListingLoading(false); return; }
      const { data: merchant } = await (supabase as any).from("merchants_public").select("business_name, district, rating, business_type").eq("id", data.merchant_id).maybeSingle();
      setListing({ ...data, merchant: { business_name: merchant?.business_name ?? "", district: merchant?.district ?? "", rating: Number(merchant?.rating ?? 0), business_type: merchant?.business_type ?? "" } });
      setPickupTime(toTimeInput(data.pickup_start));
      setListingLoading(false);
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <SiteLayout><div className="p-6 sm:p-10">Loading…</div></SiteLayout>;
  if (!isAuthenticated) return <Navigate to="/auth" search={{ redirect: `/checkout/${id}` }} />;
  if (listingLoading) return <SiteLayout><div className="p-6 sm:p-10">Loading listing…</div></SiteLayout>;
  if (!listing) return <SiteLayout><div className="container mx-auto p-6 text-center sm:p-10"><h1 className="text-2xl font-bold">Listing not found</h1><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{listingError ? `We couldn't load this listing: ${listingError}` : "This listing may have been removed or is no longer available."}</p><Button asChild className="mt-4 rounded-full"><Link to="/browse">Back to browse</Link></Button></div></SiteLayout>;

  const expired = isPastPickup(listing.pickup_end);
  if (expired) return <SiteLayout><div className="container mx-auto p-6 text-center sm:p-10"><h1 className="text-2xl font-bold">Offer expired</h1><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">The pickup window for this offer has ended, so it can no longer be reserved.</p><Button asChild className="mt-4 rounded-full"><Link to="/browse">Browse other food</Link></Button></div></SiteLayout>;

  const max = Math.max(1, Math.min(listing.quantity_available ?? 1, 5));
  const total = Number(listing.discounted_price) * qty;
  const pickupStart = toTimeInput(listing.pickup_start);
  const pickupEnd = toTimeInput(listing.pickup_end);
  const pickupValid = Boolean(pickupTime) && toMinutes(pickupTime) >= toMinutes(pickupStart) && toMinutes(pickupTime) <= toMinutes(pickupEnd);

  const place = async () => {
    if (!user) return;
    if (isPastPickup(listing.pickup_end)) { toast.error("This offer has expired."); return; }
    if (!pickupValid) { toast.error(`Choose a pickup time between ${formatTime(listing.pickup_start)} and ${formatTime(listing.pickup_end)}.`); return; }
    setPlacing(true);
    if (!listing.merchant_id) {
      setPlacing(false);
      const fakeCode = genCode();
      toast.success("Reservation confirmed — show your pickup code to the seller during pickup.");
      navigate({ to: "/order/$id", params: { id: `demo-${fakeCode}` }, search: { code: fakeCode, demo: 1, pickupTime } as any });
      return;
    }
    const pickup_code = genCode();
    const { data, error } = await (supabase as any).from("orders").insert({ user_id: user.id, listing_id: listing.id, merchant_id: listing.merchant_id, quantity: qty, total_price: total, commission_amount: 0, merchant_payout: total, pickup_code, status: "reserved", payment_status: "pending", payment_method: `pay_at_pickup|pickup_time=${pickupTime}` }).select("id").single();
    if (!error && data) await supabase.from("listings").update({ quantity_available: Math.max(0, listing.quantity_available - qty) }).eq("id", listing.id);
    setPlacing(false);
    if (error) return toast.error(error.message);
    toast.success("Reservation confirmed — the seller has received your order.");
    navigate({ to: "/order/$id", params: { id: data!.id }, search: { pickupTime } as any });
  };

  return (
    <SiteLayout>
      <section className="container mx-auto grid max-w-4xl gap-6 px-3 py-6 pb-24 sm:px-4 sm:py-10 md:grid-cols-[1.2fr_1fr] md:gap-8 md:pb-10">
        <div className="space-y-5 sm:space-y-6">
          <h1 className="text-3xl font-bold leading-tight">Checkout</h1>
          <Card className="rounded-3xl p-4 sm:p-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <img src={listing.image_url} className="h-20 w-20 shrink-0 rounded-xl object-cover" alt="" />
              <div className="min-w-0">
                <div className="line-clamp-2 font-semibold leading-tight">{listing.title}</div>
                <div className="truncate text-sm text-muted-foreground">{listing.merchant?.business_name ?? listing.merchants?.business_name}</div>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="text-sm font-medium">Quantity</span>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="outline" className="h-10 w-10 rounded-full" onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="h-4 w-4" /></Button>
                <span className="w-8 text-center font-semibold">{qty}</span>
                <Button size="icon" variant="outline" className="h-10 w-10 rounded-full" onClick={() => setQty(Math.min(max, qty + 1))}><Plus className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-cream/60 p-4 text-sm">Pickup window: <strong>{formatTime(listing.pickup_start)} – {formatTime(listing.pickup_end)}</strong></div>
            <div className="mt-4 grid gap-2">
              <Label htmlFor="pickup-time">Your pickup time</Label>
              <Input id="pickup-time" type="time" min={pickupStart} max={pickupEnd} value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} required />
              <p className="text-xs text-muted-foreground">Choose a time within the pickup window so the merchant knows when to expect you.</p>
            </div>
          </Card>
          <Card className="rounded-3xl p-4 sm:p-5"><h2 className="font-semibold">Payment</h2><p className="mt-2 text-sm text-muted-foreground">You'll pay the merchant when you collect your order.</p></Card>
        </div>
        <aside className="hidden md:block"><Card className="sticky top-24 rounded-3xl p-6"><OrderSummary qty={qty} total={total} pickupTime={pickupTime} placing={placing} place={place} disabled={!pickupValid} /></Card></aside>
      </section>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 shadow-2xl backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Total at pickup</div>
            <div className="text-2xl font-bold leading-none text-primary">{formatBND(total)}</div>
            {pickupTime && <div className="mt-1 text-xs text-muted-foreground">Pickup at {pickupTime}</div>}
          </div>
          <Button onClick={place} disabled={placing || !pickupValid} className="h-12 rounded-full px-6">{placing ? "Confirming…" : "Confirm"}</Button>
        </div>
      </div>
    </SiteLayout>
  );
}

function OrderSummary({ qty, total, pickupTime, placing, place, disabled }: { qty: number; total: number; pickupTime: string; placing: boolean; place: () => void; disabled: boolean }) {
  return <><h2 className="font-semibold">Order summary</h2><Row label={`Subtotal × ${qty}`} value={formatBND(total)} />{pickupTime && <Row label="Pickup time" value={pickupTime} />}<Row label="Service fee" value="B$0.00" /><div className="my-3 h-px bg-border" /><Row label={<span className="font-semibold">Total to pay at pickup</span>} value={<span className="text-lg font-bold">{formatBND(total)}</span>} /><Button onClick={place} disabled={placing || disabled} className="mt-5 w-full rounded-full" size="lg">{placing ? "Confirming…" : `Confirm reservation`}</Button><p className="mt-3 text-xs text-muted-foreground">No payment is taken online.</p></>;
}
function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) { return <div className="mt-2 flex items-center justify-between gap-3 text-sm">{label}<span className="text-right">{value}</span></div>; }
function formatTime(t: string) { if (!t) return ""; if (t.length <= 5) return t; try { return new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); } catch { return t; } }