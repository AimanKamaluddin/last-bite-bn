import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { sampleListings, formatBND } from "@/lib/sample-data";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout/$id")({
  component: Checkout,
});

const COMMISSION_RATE = 0.15;
const genCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

function Checkout() {
  const { id } = Route.useParams();
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [method, setMethod] = useState<"online" | "pay_at_pickup">("online");
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    (async () => {
      const local = sampleListings.find((l) => l.id === id);
      if (local) { setListing(local); return; }
      const { data } = await supabase.from("listings").select("*, merchants(*)").eq("id", id).maybeSingle();
      if (data) setListing(data);
    })();
  }, [id]);

  if (loading) return <SiteLayout><div className="p-10">Loading…</div></SiteLayout>;
  if (!isAuthenticated) return <Navigate to="/auth" search={{ redirect: `/checkout/${id}` }} />;
  if (!listing) return <SiteLayout><div className="p-10">Loading listing…</div></SiteLayout>;

  const max = Math.max(1, Math.min(listing.quantity_available ?? 1, 5));
  const total = Number(listing.discounted_price) * qty;
  const commission = +(total * COMMISSION_RATE).toFixed(2);
  const payout = +(total - commission).toFixed(2);

  const place = async () => {
    if (!user) return;
    setPlacing(true);

    // Demo / sample listing — can't insert into DB. Show demo confirmation.
    if (!listing.merchant_id) {
      setPlacing(false);
      const fakeCode = genCode();
      toast.success("Demo reservation created!");
      navigate({ to: "/order/$id", params: { id: `demo-${fakeCode}` }, search: { code: fakeCode, demo: 1 } as any });
      return;
    }

    const pickup_code = genCode();
    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        listing_id: listing.id,
        merchant_id: listing.merchant_id,
        quantity: qty,
        total_price: total,
        commission_amount: commission,
        merchant_payout: payout,
        pickup_code,
        status: "reserved",
        payment_status: method === "online" ? "paid" : "pending",
        payment_method: method,
      })
      .select("id")
      .single();

    if (!error && data) {
      await supabase.from("listings").update({ quantity_available: Math.max(0, listing.quantity_available - qty) }).eq("id", listing.id);
    }
    setPlacing(false);
    if (error) return toast.error(error.message);
    toast.success("Reservation confirmed!");
    navigate({ to: "/order/$id", params: { id: data!.id } });
  };

  return (
    <SiteLayout>
      <section className="container mx-auto grid max-w-4xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <Card className="rounded-3xl p-5">
            <div className="flex items-center gap-4">
              <img src={listing.image_url} className="h-20 w-20 rounded-xl object-cover" alt="" />
              <div>
                <div className="font-semibold">{listing.title}</div>
                <div className="text-sm text-muted-foreground">{listing.merchant?.business_name ?? listing.merchants?.business_name}</div>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm font-medium">Quantity</span>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="outline" className="rounded-full" onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="h-4 w-4" /></Button>
                <span className="w-8 text-center font-semibold">{qty}</span>
                <Button size="icon" variant="outline" className="rounded-full" onClick={() => setQty(Math.min(max, qty + 1))}><Plus className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-cream/60 p-4 text-sm">
              Pickup window: <strong>{formatTime(listing.pickup_start)} – {formatTime(listing.pickup_end)}</strong>
            </div>
          </Card>

          <Card className="rounded-3xl p-5">
            <h2 className="font-semibold">Payment</h2>
            <RadioGroup value={method} onValueChange={(v) => setMethod(v as any)} className="mt-3 space-y-3">
              <PayOption value="online" current={method} title="Pay online (demo)" desc="Mock payment for now — real gateway can be plugged in later." />
              <PayOption value="pay_at_pickup" current={method} title="Pay at pickup" desc="Pay the merchant in cash or by transfer at collection." />
            </RadioGroup>
          </Card>
        </div>

        <aside>
          <Card className="sticky top-24 rounded-3xl p-6">
            <h2 className="font-semibold">Order summary</h2>
            <Row label={`Subtotal × ${qty}`} value={formatBND(total)} />
            <Row label="Service fee" value="B$0.00" />
            <div className="my-3 h-px bg-border" />
            <Row label={<span className="font-semibold">Total</span>} value={<span className="text-lg font-bold">{formatBND(total)}</span>} />
            <Button onClick={place} disabled={placing} className="mt-5 w-full rounded-full" size="lg">
              {placing ? "Confirming…" : `Confirm reservation`}
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              You can cancel before the merchant cut-off time.
            </p>
          </Card>
        </aside>
      </section>
    </SiteLayout>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return <div className="mt-2 flex items-center justify-between text-sm">{label}<span>{value}</span></div>;
}

function PayOption({ value, current, title, desc }: { value: string; current: string; title: string; desc: string }) {
  return (
    <Label className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 ${current === value ? "border-primary bg-primary/5" : ""}`}>
      <RadioGroupItem value={value} className="mt-1" />
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{desc}</div>
      </div>
    </Label>
  );
}

function formatTime(t: string) {
  if (!t) return "";
  if (t.length <= 5) return t;
  try { return new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); } catch { return t; }
}
