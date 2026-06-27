import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdSlot } from "@/components/ads/AdSlot";
import { PickupWindowAlert } from "@/components/orders/PickupWindowAlert";
import { supabase } from "@/integrations/supabase/client";
import { formatBND } from "@/lib/sample-data";
import { formatTime12Hour } from "@/lib/time";
import { CheckCircle2 } from "lucide-react";

const searchSchema = z.object({ code: z.string().optional(), demo: z.coerce.number().optional(), pickupTime: z.string().optional() });
export const Route = createFileRoute("/order/$id")({ validateSearch: (s) => searchSchema.parse(s), component: OrderConfirmation });
const getPickupTime = (order: any) => order.pickup_time || String(order.payment_method ?? "").match(/pickup_time=([^|]+)/)?.[1] || "";

function OrderConfirmation() {
  const { id } = Route.useParams();
  const { code: demoCode, demo, pickupTime } = useSearch({ from: "/order/$id" });
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { let cancelled = false; if (demo) { setOrder({ id, pickup_code: demoCode, pickup_time: pickupTime, status: "reserved", payment_status: "demo", total_price: 0, listings: { title: "Demo surprise bag" }, merchants: { business_name: "Sample Merchant", address: "Bandar Seri Begawan", phone: "+673 000 0000" } }); setLoading(false); return; } (async () => { setLoading(true); const { data: orderData, error } = await supabase.from("orders").select("*").eq("id", id).maybeSingle(); if (cancelled) return; if (error || !orderData) { setOrder(null); setLoading(false); return; } const [{ data: listing }, { data: merchant }] = await Promise.all([supabase.from("listings").select("title, image_url, pickup_start, pickup_end").eq("id", orderData.listing_id).maybeSingle(), (supabase as any).from("merchants_public").select("business_name, district, phone, email").eq("id", orderData.merchant_id).maybeSingle()]); if (cancelled) return; setOrder({ ...orderData, listings: listing ?? null, merchants: { business_name: merchant?.business_name ?? "Merchant", address: merchant?.district ?? "", phone: merchant?.phone ?? "", email: merchant?.email ?? "" } }); setLoading(false); })(); return () => { cancelled = true; }; }, [id, demo, demoCode, pickupTime]);

  if (loading) return <SiteLayout><div className="p-10">Loading…</div></SiteLayout>;
  if (!order) return <SiteLayout><div className="p-10">Order not found.</div></SiteLayout>;

  const selectedPickupTime = formatTime12Hour(getPickupTime(order) || pickupTime);
  const buyerName = order.customer_name || order.buyer_name || order.user_name || "Buyer";
  const pickupStart = order.listings?.pickup_start || getPickupTime(order) || pickupTime;
  const pickupEnd = order.listings?.pickup_end || getPickupTime(order) || pickupTime;

  return <SiteLayout><section className="container mx-auto max-w-xl px-4 py-12 text-center"><CheckCircle2 className="mx-auto h-14 w-14 text-primary" /><h1 className="mt-4 text-3xl font-bold">Reservation confirmed!</h1><p className="mt-2 text-muted-foreground">Show your name and pickup code to the merchant.</p><div className="mt-5 text-left"><PickupWindowAlert pickupStart={pickupStart} pickupEnd={pickupEnd} /></div><Card className="mt-6 rounded-3xl p-8"><div className="rounded-2xl bg-cream/60 p-4 text-left"><div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Buyer name</div><div className="mt-1 text-2xl font-bold">{buyerName}</div></div><div className="mt-4 rounded-2xl border border-primary/20 bg-primary/10 p-5"><div className="text-sm text-muted-foreground">Pickup code</div><div className="mt-2 text-4xl font-black tracking-[0.25em] text-primary">{order.pickup_code}</div></div>{selectedPickupTime && <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900"><div className="font-semibold">Selected pickup time</div><strong className="text-lg">{selectedPickupTime}</strong><p className="mt-1 text-xs">Only collect during the pickup window.</p></div>}<div className="my-6 h-px bg-border" /><div className="text-left text-sm"><div className="font-semibold">{order.listings?.title}</div><div className="mt-1 text-muted-foreground">{order.merchants?.business_name}</div>{order.merchants?.address && <div className="text-muted-foreground">{order.merchants.address}</div>}{order.merchants?.phone && <div className="text-muted-foreground">{order.merchants.phone}</div>}</div><div className="mt-6 rounded-2xl bg-cream/60 p-4 text-left text-sm"><p className="font-semibold">Payment</p><p className="mt-1 text-muted-foreground">Pay <strong>{formatBND(Number(order.total_price))}</strong> in cash or by card when you collect your order.</p></div></Card><div className="mt-6"><AdSlot size="inline" id="ad-space-16-reservation-confirmation" slotCode="AD SPACE 16" label="AD SPACE 16 reservation confirmation" /></div><Button asChild className="mt-6 rounded-full"><Link to="/dashboard">Go to my orders</Link></Button></section></SiteLayout>;
}