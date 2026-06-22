import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { formatBND } from "@/lib/sample-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminPanel,
});

function AdminPanel() {
  const { user, isAdmin, loading } = useAuth();
  const [merchants, setMerchants] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      const [{ data: m }, { data: l }, { data: o }] = await Promise.all([
        (supabase as any).rpc("admin_list_merchants"),
        (supabase as any).from("listings").select("*, merchants(business_name)").order("created_at", { ascending: false }),
        (supabase as any).from("orders").select("*, merchants(business_name), listings(title)").order("created_at", { ascending: false }),
      ]);
      setMerchants(m ?? []); setListings(l ?? []); setOrders(o ?? []);
      setBusy(false);
    })();
  }, [isAdmin]);

  if (loading) return <SiteLayout><div className="p-10">Loading…</div></SiteLayout>;
  if (!isAdmin) {
    return (
      <SiteLayout>
        <div className="container mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Admins only</h1>
          <p className="mt-2 text-muted-foreground">
            {user ? "Your account does not have admin access." : "Please sign in as an admin."}
          </p>
          {!user && <Button asChild className="mt-4 rounded-full"><a href="/auth">Sign in</a></Button>}
        </div>
      </SiteLayout>
    );
  }

  const gmv = orders.reduce((s, o) => s + Number(o.total_price), 0);
  const commission = orders.reduce((s, o) => s + Number(o.commission_amount), 0);
  const portions = orders.reduce((s, o) => s + o.quantity, 0);

  const approve = async (id: string) => {
    const m = merchants.find((x) => x.id === id);
    const { error } = await supabase.from("merchants").update({ approval_status: "approved" }).eq("id", id);
    if (error) return toast.error(error.message);
    // grant merchant role
    if (m) await supabase.from("user_roles").insert({ user_id: m.user_id, role: "merchant" }).then(() => {});
    setMerchants((arr) => arr.map((x) => (x.id === id ? { ...x, approval_status: "approved" } : x)));
    toast.success("Merchant approved");
  };

  const reject = async (id: string) => {
    const { error } = await supabase.from("merchants").update({ approval_status: "rejected" }).eq("id", id);
    if (error) return toast.error(error.message);
    setMerchants((arr) => arr.map((x) => (x.id === id ? { ...x, approval_status: "rejected" } : x)));
  };

  const suspend = async (id: string) => {
    const { error } = await supabase.from("merchants").update({ approval_status: "suspended" }).eq("id", id);
    if (error) return toast.error(error.message);
    setMerchants((arr) => arr.map((x) => (x.id === id ? { ...x, approval_status: "suspended" } : x)));
  };

  const hide = async (id: string) => {
    const { error } = await supabase.from("listings").update({ visible: false, status: "hidden" }).eq("id", id);
    if (error) return toast.error(error.message);
    setListings((arr) => arr.map((x) => (x.id === id ? { ...x, visible: false, status: "hidden" } : x)));
  };

  return (
    <SiteLayout>
      <section className="container mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold">Admin panel</h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Merchants" value={merchants.length} />
          <Stat label="Listings" value={listings.length} />
          <Stat label="Orders" value={orders.length} />
          <Stat label="Portions saved" value={portions} />
          <Stat label="GMV" value={formatBND(gmv)} />
          <Stat label="Commission earned" value={formatBND(commission)} />
        </div>

        <Tabs defaultValue="pending" className="mt-8">
          <TabsList>
            <TabsTrigger value="pending">Pending merchants</TabsTrigger>
            <TabsTrigger value="all">All merchants</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            {busy ? "Loading…" : (
              <div className="grid gap-3">
                {merchants.filter((m) => m.approval_status === "pending").map((m) => (
                  <Card key={m.id} className="flex flex-wrap items-center gap-3 rounded-3xl p-4">
                    <div className="flex-1">
                      <div className="font-semibold">{m.business_name}</div>
                      <div className="text-sm text-muted-foreground">{m.business_type} · {m.district}</div>
                    </div>
                    <Button size="sm" variant="outline" className="rounded-full" onClick={() => reject(m.id)}>Reject</Button>
                    <Button size="sm" className="rounded-full" onClick={() => approve(m.id)}>Approve</Button>
                  </Card>
                ))}
                {merchants.filter((m) => m.approval_status === "pending").length === 0 && (
                  <Card className="rounded-3xl p-6 text-center text-muted-foreground">No pending applications.</Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="mt-4">
            <div className="grid gap-3">
              {merchants.map((m) => (
                <Card key={m.id} className="flex items-center gap-3 rounded-3xl p-4">
                  <div className="flex-1">
                    <div className="font-semibold">{m.business_name}</div>
                    <div className="text-sm text-muted-foreground">{m.business_type} · {m.district}</div>
                  </div>
                  <Badge variant="secondary" className="rounded-full capitalize">{m.approval_status}</Badge>
                  {m.approval_status === "approved" && <Button size="sm" variant="outline" className="rounded-full" onClick={() => suspend(m.id)}>Suspend</Button>}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="listings" className="mt-4">
            <div className="grid gap-3">
              {listings.map((l) => (
                <Card key={l.id} className="flex items-center gap-3 rounded-3xl p-4">
                  <div className="flex-1">
                    <div className="font-semibold">{l.title}</div>
                    <div className="text-sm text-muted-foreground">{l.merchants?.business_name} · {l.category}</div>
                  </div>
                  <Badge variant="secondary" className="rounded-full capitalize">{l.status}</Badge>
                  {l.visible && <Button size="sm" variant="outline" className="rounded-full" onClick={() => hide(l.id)}>Hide</Button>}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-4">
            <div className="grid gap-3">
              {orders.slice(0, 30).map((o) => (
                <Card key={o.id} className="flex items-center gap-3 rounded-3xl p-4">
                  <div className="flex-1">
                    <div className="font-semibold">{o.listings?.title}</div>
                    <div className="text-sm text-muted-foreground">{o.merchants?.business_name} · {formatBND(Number(o.total_price))} · commission {formatBND(Number(o.commission_amount))}</div>
                  </div>
                  <Badge variant="secondary" className="rounded-full capitalize">{o.status}</Badge>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </SiteLayout>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Card className="rounded-3xl p-5">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </Card>
  );
}
