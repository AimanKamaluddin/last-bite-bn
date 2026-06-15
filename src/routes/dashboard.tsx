import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Banknote } from "lucide-react";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { formatBND } from "@/lib/sample-data";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [saved, setSaved] = useState<any[]>([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: o }, { data: s }] = await Promise.all([
        supabase
          .from("orders")
          .select("*, listings(title, image_url), merchants(business_name, address)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("saved_merchants")
          .select("merchant_id, merchants(business_name, district, image_url)")
          .eq("user_id", user.id),
      ]);
      setOrders(o ?? []);
      setSaved(s ?? []);
      setBusy(false);
    })();
  }, [user]);

  if (loading) return <SiteLayout><div className="p-10">Loading…</div></SiteLayout>;
  if (!isAuthenticated) return <Navigate to="/auth" search={{ redirect: "/dashboard" }} />;

  const upcoming = orders.filter((o) => ["reserved", "ready"].includes(o.status));
  const past = orders.filter((o) => ["collected", "cancelled"].includes(o.status));

  const cancel = async (id: string) => {
    const { error } = await supabase.from("orders").update({ status: "cancelled" }).eq("id", id);
    if (error) return toast.error(error.message);
    setOrders((o) => o.map((x) => (x.id === id ? { ...x, status: "cancelled" } : x)));
    toast.success("Order cancelled");
  };

  return (
    <SiteLayout>
      <section className="container mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-bold">My account</h1>
        <p className="mt-1 text-muted-foreground">Welcome back, {user?.email}</p>

        <Tabs defaultValue="upcoming" className="mt-6">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming pickups</TabsTrigger>
            <TabsTrigger value="past">Past orders</TabsTrigger>
            <TabsTrigger value="saved">Saved merchants</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            {busy ? <Skel /> : upcoming.length === 0 ? <Empty msg="No upcoming pickups." /> : (
              <div className="grid gap-4">
                {upcoming.map((o) => <OrderRow key={o.id} o={o} onCancel={() => cancel(o.id)} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            {busy ? <Skel /> : past.length === 0 ? <Empty msg="No past orders yet." /> : (
              <div className="grid gap-4">
                {past.map((o) => <OrderRow key={o.id} o={o} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            {saved.length === 0 ? <Empty msg="You haven't saved any merchants yet." /> : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {saved.map((s) => (
                  <Card key={s.merchant_id} className="overflow-hidden rounded-3xl p-0">
                    {s.merchants?.image_url && <img src={s.merchants.image_url} alt="" className="h-32 w-full object-cover" />}
                    <div className="p-4">
                      <div className="font-semibold">{s.merchants?.business_name}</div>
                      <div className="text-sm text-muted-foreground">{s.merchants?.district}</div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </SiteLayout>
  );
}

function OrderRow({ o, onCancel }: { o: any; onCancel?: () => void }) {
  return (
    <Card className="flex items-center gap-4 rounded-3xl p-4">
      {o.listings?.image_url && <img src={o.listings.image_url} alt="" className="h-16 w-16 rounded-xl object-cover" />}
      <div className="flex-1">
        <div className="font-semibold">{o.listings?.title}</div>
        <div className="text-sm text-muted-foreground">{o.merchants?.business_name}</div>
        <div className="mt-1 flex items-center gap-2">
          <Badge variant="secondary" className="rounded-full capitalize">{o.status}</Badge>
          <span className="text-xs text-muted-foreground">Code: <strong>{o.pickup_code}</strong></span>
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold">{formatBND(Number(o.total_price))}</div>
        {onCancel && o.status === "reserved" && (
          <Button variant="ghost" size="sm" className="mt-2" onClick={onCancel}>Cancel</Button>
        )}
      </div>
    </Card>
  );
}

function Empty({ msg }: { msg: string }) {
  return (
    <Card className="rounded-3xl p-10 text-center">
      <p className="text-muted-foreground">{msg}</p>
      <Button asChild className="mt-4 rounded-full"><Link to="/browse">Browse food</Link></Button>
    </Card>
  );
}

function Skel() {
  return <div className="grid gap-3">{[1,2,3].map((i) => <div key={i} className="h-20 animate-pulse rounded-3xl bg-muted" />)}</div>;
}
