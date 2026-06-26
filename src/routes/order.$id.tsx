import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatBND } from "@/lib/sample-data";
import { CheckCircle2 } from "lucide-react";

const searchSchema = z.object({ code: z.string().optional(), demo: z.coerce.number().optional() });

export const Route = createFileRoute("/order/$id")({
  validateSearch: (s) => searchSchema.parse(s),
  component: OrderConfirmation,
});

function OrderConfirmation() {
  const { id } = Route.useParams();
  const { code: demoCode, demo } = useSearch({ from: "/order/$id" });
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (demo) {
      setOrder({
        id,
        pickup_code: demoCode,
        status: "reserved",
        payment_status: "demo",
        total_price: 0,
        listings: { title: "Demo surprise bag" },
        merchants: { business_name: "Sample Merchant", address: "Bandar Seri Begawan", phone: "+673 000 0000" },
      });
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);

      const { data: orderData, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (cancelled) return;

      if (error || !orderData) {
        setOrder(null);
        setLoading(false);
        return;
      }

      const [{ data: listing }, { data: merchant }] = await Promise.all([
        supabase
          .from("listings")
          .select("title, image_url")
          .eq("id", orderData.listing_id)
          .maybeSingle(),
        (supabase as any)
          .from("merchants_public")
          .select("business_name, district, phone, email")
          .eq("id", orderData.merchant_id)
          .maybeSingle(),
      ]);

      if (cancelled) return;

      setOrder({
        ...orderData,
        listings: listing ?? null,
        merchants: {
          business_name: merchant?.business_name ?? "Merchant",
          address: merchant?.district ?? "",
          phone: merchant?.phone ?? "",
          email: merchant?.email ?? "",
        },
      });
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [id, demo, demoCode]);

  if (loading) return <SiteLayout><div className="p-10">Loading…</div></SiteLayout>;
  if (!order) return <SiteLayout><div className="p-10">Order not found.</div></SiteLayout>;

  // simple QR proxy
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(order.pickup_code)}`;

  return (
    <SiteLayout>
      <section className="container mx-auto max-w-xl px-4 py-12 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
        <h1 className="mt-4 text-3xl font-bold">Reservation confirmed!</h1>
        <p className="mt-2 text-muted-foreground">Show this code to the merchant during pickup.</p>

        <Card className="mt-6 rounded-3xl p-8">
          <img src={qr} alt="Pickup QR code" className="mx-auto" width={200} height={200} />
          <div className="mt-4 text-3xl font-bold tracking-[0.4em] text-primary">{order.pickup_code}</div>
          <div className="mt-1 text-sm text-muted-foreground">Pickup code</div>

          <div className="my-6 h-px bg-border" />
          <div className="text-left text-sm">
            <div className="font-semibold">{order.listings?.title}</div>
            <div className="mt-1 text-muted-foreground">{order.merchants?.business_name}</div>
            {order.merchants?.address && <div className="text-muted-foreground">{order.merchants.address}</div>}
            {order.merchants?.phone && <div className="text-muted-foreground">{order.merchants.phone}</div>}
          </div>

          <div className="mt-6 rounded-2xl bg-cream/60 p-4 text-left text-sm">
            <p className="font-semibold">Payment</p>
            <p className="mt-1 text-muted-foreground">
              Pay <strong>{formatBND(Number(order.total_price))}</strong> in cash or by card when you collect your order.
            </p>
          </div>
        </Card>

        <Button asChild className="mt-6 rounded-full">
          <Link to="/dashboard">Go to my orders</Link>
        </Button>
      </section>
    </SiteLayout>
  );
}
