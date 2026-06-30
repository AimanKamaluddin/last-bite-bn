import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "@/components/upload/ImageUpload";
import { useAuth } from "@/hooks/use-auth";
import { CATEGORIES } from "@/lib/sample-data";
import { toast } from "sonner";

export const Route = createFileRoute("/merchant/new-listing")({ component: NewListing });

const todayInput = () => new Date().toISOString().slice(0, 10);
const dayName = (date: string) => date ? new Date(`${date}T00:00:00`).toLocaleDateString([], { weekday: "long" }) : "";
const toIso = (date: string, time: string) => date && time ? new Date(`${date}T${time}:00`).toISOString() : null;

function NewListing() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: CATEGORIES[0] as string,
    original_price: 10,
    discounted_price: 4,
    quantity_available: 5,
    listing_date: todayInput(),
    produced_date: todayInput(),
    produced_time: "",
    pickup_start: "",
    pickup_end: "",
    allergen_info: "",
    images: [] as string[],
    visible: true,
  });

  useEffect(() => {
    if (!user) return;
    (supabase as any).rpc("get_my_merchant").then(({ data }: any) => setMerchant(Array.isArray(data) && data.length ? data[0] : null));
  }, [user]);

  if (loading) return <SiteLayout><div className="p-10">Loading…</div></SiteLayout>;
  if (!isAuthenticated) return <Navigate to="/auth" search={{ redirect: "/merchant/new-listing" }} />;
  if (merchant === null) return <SiteLayout><div className="p-10">Loading…</div></SiteLayout>;
  if (!merchant) return <Navigate to="/merchant/onboarding" />;
  if (merchant.approval_status !== "approved") return <SiteLayout><div className="p-10 text-center">Your merchant account isn't approved yet.</div></SiteLayout>;

  const save = async (status: "active" | "draft") => {
    if (!form.listing_date || !form.produced_date || !form.produced_time || !form.pickup_start || !form.pickup_end) {
      toast.error("Please fill in listing date, production date/time, and pickup window.");
      return;
    }

    setSaving(true);
    const { images, listing_date, produced_date, produced_time, ...rest } = form;
    const payload: any = {
      merchant_id: merchant.id,
      ...rest,
      image_url: images[0] ?? null,
      images,
      created_at: new Date(`${listing_date}T00:00:00`).toISOString(),
      produced_at: toIso(produced_date, produced_time),
      pickup_start: new Date(`${listing_date}T${form.pickup_start}:00`).toISOString(),
      pickup_end: new Date(`${listing_date}T${form.pickup_end}:00`).toISOString(),
      status,
    };

    const { error } = await (supabase as any).from("listings").insert(payload);

    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(status === "active" ? "Listing published!" : "Draft saved.");
    navigate({ to: "/merchant" });
  };

  return (
    <SiteLayout>
      <section className="container mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-3xl font-bold">Create new listing</h1>
        <Card className="mt-6 rounded-3xl p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <F label="Title" full><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></F>
            <F label="Category"><Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></F>
            <F label="Quantity available"><Input type="number" min={0} value={form.quantity_available} onChange={(e) => setForm({ ...form, quantity_available: +e.target.value })} /></F>
            <F label="Original price (B$)"><Input type="number" step="0.5" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: +e.target.value })} /></F>
            <F label="Discounted price (B$)"><Input type="number" step="0.5" value={form.discounted_price} onChange={(e) => setForm({ ...form, discounted_price: +e.target.value })} /></F>
            <F label="Date listed"><Input type="date" value={form.listing_date} onChange={(e) => setForm({ ...form, listing_date: e.target.value })} /><div className="mt-1 text-xs text-muted-foreground">{dayName(form.listing_date)}</div></F>
            <F label="Produced date"><Input type="date" value={form.produced_date} onChange={(e) => setForm({ ...form, produced_date: e.target.value })} /></F>
            <F label="Produced time"><Input type="time" value={form.produced_time} onChange={(e) => setForm({ ...form, produced_time: e.target.value })} /></F>
            <F label="Pickup start"><Input type="time" value={form.pickup_start} onChange={(e) => setForm({ ...form, pickup_start: e.target.value })} /></F>
            <F label="Pickup end"><Input type="time" value={form.pickup_end} onChange={(e) => setForm({ ...form, pickup_end: e.target.value })} /></F>
            <F label="Description" full><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></F>
            <F label="Allergen info" full><Input value={form.allergen_info} onChange={(e) => setForm({ ...form, allergen_info: e.target.value })} placeholder="Contains: gluten, dairy…" /></F>
            <F label="Photos" full><ImageUpload multiple value={form.images} onChange={(v) => setForm({ ...form, images: v })} /></F>
            <div className="sm:col-span-2 flex items-center justify-between rounded-2xl bg-cream/60 p-3">
              <div><div className="font-medium">Visible to customers</div><div className="text-sm text-muted-foreground">Turn off to hide while editing.</div></div>
              <Switch checked={form.visible} onCheckedChange={(v) => setForm({ ...form, visible: v })} />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" className="flex-1 rounded-full" disabled={saving} onClick={() => save("draft")}>Save draft</Button>
            <Button className="flex-1 rounded-full" disabled={saving} onClick={() => save("active")}>Publish</Button>
          </div>
        </Card>
      </section>
    </SiteLayout>
  );
}

function F({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <div className={full ? "sm:col-span-2" : ""}><Label className="mb-1.5 block text-sm">{label}</Label>{children}</div>;
}
