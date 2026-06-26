import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { formatBND } from "@/lib/sample-data";
import { toast } from "sonner";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Package,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Store,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPanel,
});

type Merchant = {
  id: string;
  user_id: string;
  business_name: string;
  business_type: string;
  district: string;
  approval_status: string;
  halal_status?: string | null;
  contact_person?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  created_at?: string;
  rating?: number | null;
};

type Listing = {
  id: string;
  title: string;
  category: string;
  status: string;
  visible: boolean;
  quantity_available: number;
  original_price: number;
  discounted_price: number;
  pickup_start: string;
  pickup_end: string;
  created_at: string;
  merchants?: { business_name?: string | null } | null;
};

type Order = {
  id: string;
  status: string;
  payment_status: string;
  payment_method: string;
  pickup_code: string;
  quantity: number;
  total_price: number;
  commission_amount: number;
  merchant_payout: number;
  created_at: string;
  merchants?: { business_name?: string | null } | null;
  listings?: { title?: string | null } | null;
};

const statusTone: Record<string, string> = {
  approved: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  pending: "bg-amber-500/10 text-amber-700 border-amber-200",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  suspended: "bg-slate-500/10 text-slate-700 border-slate-200",
  active: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  hidden: "bg-slate-500/10 text-slate-700 border-slate-200",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  completed: "bg-primary/10 text-primary border-primary/20",
};

function AdminPanel() {
  const { user, isAdmin, loading } = useAuth();
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [busy, setBusy] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const loadAdminData = async () => {
    setBusy(true);
    const [{ data: m, error: me }, { data: l, error: le }, { data: o, error: oe }] = await Promise.all([
      (supabase as any).rpc("admin_list_merchants"),
      (supabase as any)
        .from("listings")
        .select("*, merchants(business_name)")
        .order("created_at", { ascending: false }),
      (supabase as any)
        .from("orders")
        .select("*, merchants(business_name), listings(title)")
        .order("created_at", { ascending: false }),
    ]);

    if (me || le || oe) toast.error(me?.message || le?.message || oe?.message || "Could not load admin data");
    setMerchants(m ?? []);
    setListings(l ?? []);
    setOrders(o ?? []);
    setBusy(false);
  };

  useEffect(() => {
    if (!isAdmin) return;
    loadAdminData();
  }, [isAdmin]);

  const filteredMerchants = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return merchants;
    return merchants.filter((m) => [m.business_name, m.business_type, m.district, m.email, m.phone, m.approval_status].some((v) => String(v ?? "").toLowerCase().includes(q)));
  }, [merchants, query]);

  const filteredListings = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return listings;
    return listings.filter((l) => [l.title, l.category, l.status, l.merchants?.business_name].some((v) => String(v ?? "").toLowerCase().includes(q)));
  }, [listings, query]);

  const filteredOrders = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return orders;
    return orders.filter((o) => [o.id, o.pickup_code, o.status, o.payment_status, o.listings?.title, o.merchants?.business_name].some((v) => String(v ?? "").toLowerCase().includes(q)));
  }, [orders, query]);

  if (loading) return <SiteLayout><div className="p-10">Loading…</div></SiteLayout>;
  if (!isAdmin) {
    return (
      <SiteLayout>
        <div className="container mx-auto max-w-md px-4 py-20 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-bold">Admins only</h1>
          <p className="mt-2 text-muted-foreground">
            {user ? "Your account does not have admin access." : "Please sign in as an admin."}
          </p>
          {!user && <Button asChild className="mt-4 rounded-full"><a href="/auth">Sign in</a></Button>}
        </div>
      </SiteLayout>
    );
  }

  const pendingMerchants = merchants.filter((m) => m.approval_status === "pending");
  const approvedMerchants = merchants.filter((m) => m.approval_status === "approved");
  const suspendedMerchants = merchants.filter((m) => m.approval_status === "suspended");
  const activeListings = listings.filter((l) => l.visible && l.status === "active");
  const hiddenListings = listings.filter((l) => !l.visible || l.status === "hidden");
  const openOrders = orders.filter((o) => !["completed", "cancelled"].includes(o.status));
  const completedOrders = orders.filter((o) => o.status === "completed");
  const gmv = orders.reduce((s, o) => s + Number(o.total_price || 0), 0);
  const commission = orders.reduce((s, o) => s + Number(o.commission_amount || 0), 0);
  const merchantPayout = orders.reduce((s, o) => s + Number(o.merchant_payout || 0), 0);
  const portions = orders.reduce((s, o) => s + Number(o.quantity || 0), 0);
  const avgOrder = orders.length ? gmv / orders.length : 0;

  const updateMerchantStatus = async (id: string, approval_status: string) => {
    setActionId(id);
    const merchant = merchants.find((m) => m.id === id);
    const { error } = await supabase.from("merchants").update({ approval_status }).eq("id", id);
    if (error) {
      setActionId(null);
      return toast.error(error.message);
    }
    if (approval_status === "approved" && merchant?.user_id) {
      await supabase.from("user_roles").insert({ user_id: merchant.user_id, role: "merchant" }).then(() => {});
    }
    setMerchants((arr) => arr.map((m) => (m.id === id ? { ...m, approval_status } : m)));
    setActionId(null);
    toast.success(`Merchant ${approval_status}`);
  };

  const updateListing = async (id: string, changes: Partial<Listing>) => {
    setActionId(id);
    const { error } = await supabase.from("listings").update(changes).eq("id", id);
    if (error) {
      setActionId(null);
      return toast.error(error.message);
    }
    setListings((arr) => arr.map((l) => (l.id === id ? { ...l, ...changes } : l)));
    setActionId(null);
    toast.success(changes.visible === false ? "Listing hidden" : changes.visible === true ? "Listing restored" : "Listing updated");
  };

  const updateOrderStatus = async (id: string, status: string) => {
    setActionId(id);
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) {
      setActionId(null);
      return toast.error(error.message);
    }
    setOrders((arr) => arr.map((o) => (o.id === id ? { ...o, status } : o)));
    setActionId(null);
    toast.success(`Order marked ${status}`);
  };

  return (
    <SiteLayout>
      <section className="container mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <ShieldCheck className="h-3.5 w-3.5" /> Marketplace operations
            </div>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">Admin command centre</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">Approve merchants, moderate listings, track orders, monitor marketplace health, and keep Last Bite BN running smoothly.</p>
          </div>
          <Button variant="outline" className="rounded-full" onClick={loadAdminData} disabled={busy}>
            <RefreshCw className={busy ? "animate-spin" : ""} /> Refresh data
          </Button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <Stat icon={Store} label="Merchants" value={merchants.length} helper={`${pendingMerchants.length} pending`} />
          <Stat icon={CheckCircle2} label="Approved" value={approvedMerchants.length} helper={`${suspendedMerchants.length} suspended`} />
          <Stat icon={Package} label="Active listings" value={activeListings.length} helper={`${hiddenListings.length} hidden`} />
          <Stat icon={ShoppingBag} label="Orders" value={orders.length} helper={`${openOrders.length} open`} />
          <Stat icon={TrendingUp} label="GMV" value={formatBND(gmv)} helper={`Avg ${formatBND(avgOrder)}`} />
          <Stat icon={BarChart3} label="Commission" value={formatBND(commission)} helper={`${formatBND(merchantPayout)} payouts`} />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Card className="rounded-3xl p-5 lg:col-span-2">
            <div className="flex items-center gap-2 font-semibold"><AlertTriangle className="h-5 w-5 text-amber-600" /> Needs attention</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <MiniQueue label="Pending merchant applications" value={pendingMerchants.length} />
              <MiniQueue label="Open / active orders" value={openOrders.length} />
              <MiniQueue label="Hidden listings" value={hiddenListings.length} />
            </div>
          </Card>
          <Card className="rounded-3xl p-5">
            <div className="font-semibold">Impact snapshot</div>
            <div className="mt-4 space-y-3 text-sm">
              <Row label="Portions rescued" value={portions} />
              <Row label="Completed orders" value={completedOrders.length} />
              <Row label="Marketplace take-rate" value={gmv ? `${((commission / gmv) * 100).toFixed(1)}%` : "0%"} />
            </div>
          </Card>
        </div>

        <div className="mt-8 flex flex-col gap-3 rounded-3xl border bg-card p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Search className="h-4 w-4" /> Search merchants, listings, orders, pickup codes, districts, or statuses
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search admin data…"
            className="h-10 rounded-full border bg-background px-4 text-sm outline-none ring-primary/20 transition focus:ring-4 md:w-80"
          />
        </div>

        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="flex h-auto flex-wrap justify-start rounded-2xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pending">Approvals</TabsTrigger>
            <TabsTrigger value="merchants">Merchants</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Panel title="Latest merchant applications" empty="No merchant applications yet.">
                {pendingMerchants.slice(0, 5).map((m) => <MerchantCard key={m.id} merchant={m} actionId={actionId} onStatus={updateMerchantStatus} compact />)}
              </Panel>
              <Panel title="Recent orders" empty="No orders yet.">
                {orders.slice(0, 5).map((o) => <OrderCard key={o.id} order={o} actionId={actionId} onStatus={updateOrderStatus} compact />)}
              </Panel>
            </div>
          </TabsContent>

          <TabsContent value="pending" className="mt-4">
            <Panel title={`Merchant approvals (${pendingMerchants.length})`} empty="No pending applications.">
              {filteredMerchants.filter((m) => m.approval_status === "pending").map((m) => <MerchantCard key={m.id} merchant={m} actionId={actionId} onStatus={updateMerchantStatus} />)}
            </Panel>
          </TabsContent>

          <TabsContent value="merchants" className="mt-4">
            <Panel title={`All merchants (${filteredMerchants.length})`} empty="No merchants match your search.">
              {filteredMerchants.map((m) => <MerchantCard key={m.id} merchant={m} actionId={actionId} onStatus={updateMerchantStatus} />)}
            </Panel>
          </TabsContent>

          <TabsContent value="listings" className="mt-4">
            <Panel title={`Listing moderation (${filteredListings.length})`} empty="No listings match your search.">
              {filteredListings.map((l) => <ListingCardAdmin key={l.id} listing={l} actionId={actionId} onUpdate={updateListing} />)}
            </Panel>
          </TabsContent>

          <TabsContent value="orders" className="mt-4">
            <Panel title={`Order operations (${filteredOrders.length})`} empty="No orders match your search.">
              {filteredOrders.map((o) => <OrderCard key={o.id} order={o} actionId={actionId} onStatus={updateOrderStatus} />)}
            </Panel>
          </TabsContent>
        </Tabs>
      </section>
    </SiteLayout>
  );
}

function Stat({ icon: Icon, label, value, helper }: { icon: any; label: string; value: React.ReactNode; helper?: string }) {
  return (
    <Card className="rounded-3xl p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
      </div>
      <div className="mt-4 text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
      {helper && <div className="mt-2 text-xs text-muted-foreground">{helper}</div>}
    </Card>
  );
}

function MiniQueue({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl border bg-muted/30 p-4"><div className="text-2xl font-bold">{value}</div><div className="text-sm text-muted-foreground">{label}</div></div>;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-4"><span className="text-muted-foreground">{label}</span><span className="font-semibold">{value}</span></div>;
}

function Panel({ title, empty, children }: { title: string; empty: string; children: React.ReactNode }) {
  const items = Array.isArray(children) ? children.filter(Boolean) : children;
  const hasItems = Array.isArray(items) ? items.length > 0 : Boolean(items);
  return (
    <Card className="rounded-3xl p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {hasItems ? <div className="grid gap-3">{items}</div> : <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">{empty}</div>}
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  return <Badge variant="outline" className={`rounded-full capitalize ${statusTone[status] ?? ""}`}>{status}</Badge>;
}

function MerchantCard({ merchant, actionId, onStatus, compact = false }: { merchant: Merchant; actionId: string | null; onStatus: (id: string, status: string) => void; compact?: boolean }) {
  const disabled = actionId === merchant.id;
  return (
    <Card className="rounded-3xl p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-semibold">{merchant.business_name}</div>
            <StatusBadge status={merchant.approval_status} />
          </div>
          <div className="mt-1 text-sm text-muted-foreground">{merchant.business_type} · {merchant.district}{merchant.halal_status ? ` · ${merchant.halal_status}` : ""}</div>
          {!compact && <div className="mt-3 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
            <span>Contact: {merchant.contact_person || "—"}</span>
            <span>Phone: {merchant.phone || "—"}</span>
            <span>Email: {merchant.email || "—"}</span>
            <span>Joined: {formatDate(merchant.created_at)}</span>
          </div>}
        </div>
        <div className="flex flex-wrap gap-2">
          {merchant.approval_status !== "approved" && <Button size="sm" className="rounded-full" disabled={disabled} onClick={() => onStatus(merchant.id, "approved")}><CheckCircle2 /> Approve</Button>}
          {merchant.approval_status === "pending" && <Button size="sm" variant="outline" className="rounded-full" disabled={disabled} onClick={() => onStatus(merchant.id, "rejected")}><XCircle /> Reject</Button>}
          {merchant.approval_status === "approved" && <Button size="sm" variant="outline" className="rounded-full" disabled={disabled} onClick={() => onStatus(merchant.id, "suspended")}><AlertTriangle /> Suspend</Button>}
          {merchant.approval_status === "suspended" && <Button size="sm" variant="outline" className="rounded-full" disabled={disabled} onClick={() => onStatus(merchant.id, "approved")}>Reactivate</Button>}
        </div>
      </div>
    </Card>
  );
}

function ListingCardAdmin({ listing, actionId, onUpdate }: { listing: Listing; actionId: string | null; onUpdate: (id: string, changes: Partial<Listing>) => void }) {
  const hidden = !listing.visible || listing.status === "hidden";
  const disabled = actionId === listing.id;
  return (
    <Card className="rounded-3xl p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-semibold">{listing.title}</div>
            <StatusBadge status={listing.status} />
            {!listing.visible && <Badge variant="secondary" className="rounded-full">Not visible</Badge>}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">{listing.merchants?.business_name || "Unknown merchant"} · {listing.category}</div>
          <div className="mt-3 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-5">
            <span>Price: {formatBND(Number(listing.discounted_price))}</span>
            <span>Was: {formatBND(Number(listing.original_price))}</span>
            <span>Qty: {listing.quantity_available}</span>
            <span>Pickup: {formatDate(listing.pickup_start)}</span>
            <span>Ends: {formatDate(listing.pickup_end)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {hidden ? (
            <Button size="sm" className="rounded-full" disabled={disabled} onClick={() => onUpdate(listing.id, { visible: true, status: "active" })}><Eye /> Restore</Button>
          ) : (
            <Button size="sm" variant="outline" className="rounded-full" disabled={disabled} onClick={() => onUpdate(listing.id, { visible: false, status: "hidden" })}><EyeOff /> Hide</Button>
          )}
          {listing.status !== "cancelled" && <Button size="sm" variant="outline" className="rounded-full" disabled={disabled} onClick={() => onUpdate(listing.id, { status: "cancelled", visible: false })}>Cancel</Button>}
        </div>
      </div>
    </Card>
  );
}

function OrderCard({ order, actionId, onStatus, compact = false }: { order: Order; actionId: string | null; onStatus: (id: string, status: string) => void; compact?: boolean }) {
  const disabled = actionId === order.id;
  return (
    <Card className="rounded-3xl p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-semibold">{order.listings?.title || "Order"}</div>
            <StatusBadge status={order.status} />
            <Badge variant="secondary" className="rounded-full capitalize">{order.payment_status}</Badge>
          </div>
          <div className="mt-1 text-sm text-muted-foreground">{order.merchants?.business_name || "Unknown merchant"} · code {order.pickup_code}</div>
          {!compact && <div className="mt-3 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-5">
            <span>Total: {formatBND(Number(order.total_price))}</span>
            <span>Commission: {formatBND(Number(order.commission_amount))}</span>
            <span>Payout: {formatBND(Number(order.merchant_payout))}</span>
            <span>Qty: {order.quantity}</span>
            <span>Created: {formatDate(order.created_at)}</span>
          </div>}
        </div>
        <div className="flex flex-wrap gap-2">
          {order.status !== "completed" && <Button size="sm" className="rounded-full" disabled={disabled} onClick={() => onStatus(order.id, "completed")}><CheckCircle2 /> Complete</Button>}
          {order.status !== "cancelled" && <Button size="sm" variant="outline" className="rounded-full" disabled={disabled} onClick={() => onStatus(order.id, "cancelled")}><XCircle /> Cancel</Button>}
          {order.status === "cancelled" && <Button size="sm" variant="outline" className="rounded-full" disabled={disabled} onClick={() => onStatus(order.id, "pending")}><Clock /> Reopen</Button>}
        </div>
      </div>
    </Card>
  );
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
