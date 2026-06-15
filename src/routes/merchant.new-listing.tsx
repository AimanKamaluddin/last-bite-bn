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
import { useAuth } from "@/hooks/use-auth";
import { CATEGORIES } from "@/lib/sample-data";
import { toast } from "sonner";

export const Route = createFileRoute("/merchant/new-listing")({
  component: NewListing,
});

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
    pickup_start: "",
    pickup_end: "",
    allergen_info: "",
    halal_info: "Halal certified",
    image_url: "",
    visible: true,
  });

  useEffect(() => {
    if (!user) return;
    supabase.from("merchants").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => setMerchant(data));
  }, [user]);

  if (loading) return <SiteLayout><div className="p-10">Loading…</div></SiteLayout>;
  if (!isAuthenticated) return <Navigate to="/auth" search={{ redirect: "/merchant/new-listing" }} />;
  if (merchant === null) return <SiteLayout><div className="p-10">Loading…</div></SiteLayout>;
  if (!merchant) return <Navigate to="/merchant/onboarding" />;
  if (merchant.approval_status !== "approved")
    return <SiteLayout><div className="p-10 text-center">Your merchant account isn't approved yet.</div></SiteLayout>;

  const save = async (status: "active" | "draft") => {
    setSaving(true);
    const today = new Date().toISOString().slice(0, 10);
    const { error } = await supabase.from("listings").insert({
      merchant_id: merchant.id,
      ...form,
      pickup_start: new Date(`${today}T${form.pickup_start}:00`).toISOString(),
      pickup_end: new Date(`${today}T${form.pickup_end}:00`).toISOString(),
      status,
    });
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
            <F label="Category">
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </F>
            <F label="Quantity available"><Input type="number" min={0} value={form.quantity_available} onChange={(e) => setForm({ ...form, quantity_available: +e.target.value })} /></F>
            <F label="Original price (B$)"><Input type="number" step="0.5" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: +e.target.value })} /></F>
            <F label="Discounted price (B$)"><Input type="number" step="0.5" value={form.discounted_price} onChange={(e) => setForm({ ...form, discounted_price: +e.target.value })} /></F>
            <F label="Pickup start (today)"><Input type="time" value={form.pickup_start} onChange={(e) => setForm({ ...form, pickup_start: e.target.value })} /></F>
            <F label="Pickup end (today)"><Input type="time" value={form.pickup_end} onChange={(e) => setForm({ ...form, pickup_end: e.target.value })} /></F>
            <F label="Description" full><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></F>
            <F label="Allergen info" full><Input value={form.allergen_info} onChange={(e) => setForm({ ...form, allergen_info: e.target.value })} placeholder="Contains: gluten, dairy…" /></F>
            <F label="Halal info" full><Input value={form.halal_info} onChange={(e) => setForm({ ...form, halal_info: e.target.value })} /></F>
            <F label="Image URL" full><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://…" /></F>
            <div className="sm:col-span-2 flex items-center justify-between rounded-2xl bg-cream/60 p-3">
              <div>
                <div className="font-medium">Visible to customers</div>
                <div className="text-sm text-muted-foreground">Turn off to hide while editing.</div>
              </div>
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
