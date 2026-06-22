import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { formatBND } from "@/lib/sample-data";
import { Plus, Store, ShoppingBag, TrendingUp, Sprout, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/merchant/")({
  component: MerchantDashboard,
});

function MerchantDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [merchant, setMerchant] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: rows } = await (supabase as any).rpc("get_my_merchant");
      const m = Array.isArray(rows) && rows.length ? rows[0] : null;
      setMerchant(m);
      if (m) {
        const [{ data: l }, { data: o }] = await Promise.all([
          supabase.from("listings").select("*").eq("merchant_id", m.id).order("created_at", { ascending: false }),
          supabase.from("orders").select("*, listings(title)").eq("merchant_id", m.id).order("created_at", { ascending: false }),
        ]);
        setListings(l ?? []);
        setOrders(o ?? []);
      }
      setBusy(false);
    })();
  }, [user]);

  if (loading || busy) return <SiteLayout><div className="p-10">Loading…</div></SiteLayout>;
  if (!isAuthenticated) return <Navigate to="/auth" search={{ redirect: "/merchant" }} />;
  if (!merchant) return <Navigate to="/merchant/onboarding" />;

  if (merchant.approval_status !== "approved") {
    return (
      <SiteLayout>
        <section className="container mx-auto max-w-xl px-4 py-16">
          <Card className="rounded-3xl p-8 text-center">
            <Store className="mx-auto h-10 w-10 text-primary" />
            <h1 className="mt-3 text-2xl font-bold">Application under review</h1>
            <p className="mt-2 text-muted-foreground">
              Our team is reviewing your merchant application. You'll be able to publish listings once approved.
            </p>
            <Badge variant="secondary" className="mt-4 rounded-full capitalize">{merchant.approval_status}</Badge>
          </Card>
        </section>
      </SiteLayout>
    );
  }

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const ordersToday = orders.filter((o) => new Date(o.created_at) >= today);
  const revenue = orders.filter((o) => o.status === "collected").reduce((s, o) => s + Number(o.total_price), 0);
  const portions = orders.reduce((s, o) => s + o.quantity, 0);

  const setStatus = async (id: string, status: string) => {
    const update: any = { status };
    if (status === "collected") update.payment_status = "paid";
    const { error } = await supabase.from("orders").update(update).eq("id", id);
    if (error) return toast.error(error.message);
    setOrders((arr) => arr.map((o) => (o.id === id ? { ...o, ...update } : o)));
  };

  return (
    <SiteLayout>
      <section className="container mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">{merchant.business_name}</h1>
            <p className="text-sm text-muted-foreground">Merchant dashboard</p>
          </div>
          <Button asChild className="rounded-full"><Link to="/merchant/new-listing"><Plus className="mr-2 h-4 w-4" />New listing</Link></Button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Store} label="Active listings" value={listings.filter(l => l.status === "active").length} />
          <StatCard icon={ShoppingBag} label="Orders today" value={ordersToday.length} />
          <StatCard icon={TrendingUp} label="Revenue" value={formatBND(revenue)} />
          <StatCard icon={Sprout} label="Portions saved" value={portions} />
        </div>

        <h2 className="mt-10 text-xl font-semibold">Recent orders</h2>
        {orders.length === 0 ? (
          <Card className="mt-3 rounded-3xl p-8 text-center text-muted-foreground">No orders yet.</Card>
        ) : (
          <div className="mt-3 grid gap-3">
            {orders.slice(0, 10).map((o) => (
              <Card key={o.id} className="flex flex-wrap items-center gap-4 rounded-3xl p-4">
                <div className="flex-1">
                  <div className="font-semibold">{o.listings?.title}</div>
                  <div className="text-sm text-muted-foreground">
                    Qty {o.quantity} · {formatBND(Number(o.total_price))} · Code <strong>{o.pickup_code}</strong>
                  </div>
                </div>
                <Badge variant="secondary" className="rounded-full capitalize">{o.status}</Badge>
                {o.status === "reserved" && <Button size="sm" variant="outline" className="rounded-full" onClick={() => setStatus(o.id, "ready")}>Mark ready</Button>}
                {o.status === "ready" && <Button size="sm" className="rounded-full" onClick={() => setStatus(o.id, "collected")}>Mark collected</Button>}
              </Card>
            ))}
          </div>
        )}

        <h2 className="mt-10 text-xl font-semibold">Your listings</h2>
        {listings.length === 0 ? (
          <Card className="mt-3 rounded-3xl p-8 text-center text-muted-foreground">
            No listings yet. <Link to="/merchant/new-listing" className="text-primary underline">Create your first one</Link>.
          </Card>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
              <Card key={l.id} className="overflow-hidden rounded-3xl p-0">
                {l.image_url && <img src={l.image_url} alt="" className="h-32 w-full object-cover" />}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold">{l.title}</div>
                      <div className="text-xs text-muted-foreground">{l.category}</div>
                    </div>
                    <Badge variant="secondary" className="rounded-full capitalize">{l.status}</Badge>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground line-through">{formatBND(Number(l.original_price))}</span>{" "}
                    <span className="font-semibold text-primary">{formatBND(Number(l.discounted_price))}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{l.quantity_available} left</div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

function StatCard({ icon: Icon, label, value }: any) {
  return (
    <Card className="rounded-3xl p-5">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </Card>
  );
}
