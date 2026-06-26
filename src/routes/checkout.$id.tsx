import { createFileRoute, useNavigate, Navigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const [listingLoading, setListingLoading] = useState(true);
  const [listingError, setListingError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setListingLoading(true);
      setListingError(null);

      const local = sampleListings.find((l) => l.id === id);
      if (local) {
        if (!cancelled) {
          setListing(local);
          setListingLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        setListing(null);
        setListingError(error.message);
        setListingLoading(false);
        return;
      }

      if (!data) {
        setListing(null);
        setListingLoading(false);
        return;
      }

      const { data: merchant } = await (supabase as any)
        .from("merchants_public")
        .select("business_name, district, rating, business_type")
        .eq("id", data.merchant_id)
        .maybeSingle();

      setListing({
        ...data,
        merchant: {
          business_name: merchant?.business_name ?? "",
          district: merchant?.district ?? "",
          rating: Number(merchant?.rating ?? 0),
          business_type: merchant?.business_type ?? "",
        },
      });
      setListingLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <SiteLayout><div className="p-10">Loading…</div></SiteLayout>;
  if (!isAuthenticated) return <Navigate to="/auth" search={{ redirect: `/checkout/${id}` }} />;
  if (listingLoading) return <SiteLayout><div className="p-10">Loading listing…</div></SiteLayout>;
  if (!listing) {
    return (
      <SiteLayout>
        <div className="container mx-auto p-10 text-center">
          <h1 className="text-2xl font-bold">Listing not found</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            {listingError ? `We couldn't load this listing: ${listingError}` : "This listing may have been removed or is no longer available."}
          </p>
          <Button asChild className="mt-4 rounded-full">
            <Link to="/browse">Back to browse</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

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
        payment_status: "pending",
        payment_method: "pay_at_pickup",
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
            <p className="mt-2 text-sm text-muted-foreground">
              You'll pay the merchant in cash or by card when you collect your order.
            </p>
          </Card>
        </div>

        <aside>
          <Card className="sticky top-24 rounded-3xl p-6">
            <h2 className="font-semibold">Order summary</h2>
            <Row label={`Subtotal × ${qty}`} value={formatBND(total)} />
            <Row label="Service fee" value="B$0.00" />
            <div className="my-3 h-px bg-border" />
            <Row label={<span className="font-semibold">Total to pay at pickup</span>} value={<span className="text-lg font-bold">{formatBND(total)}</span>} />
            <Button onClick={place} disabled={placing} className="mt-5 w-full rounded-full" size="lg">
              {placing ? "Confirming…" : `Confirm reservation`}
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              You can cancel before the merchant cut-off time. No payment is taken online.
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

function formatTime(t: string) {
  if (!t) return "";
  if (t.length <= 5) return t;
  try { return new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); } catch { return t; }
}
