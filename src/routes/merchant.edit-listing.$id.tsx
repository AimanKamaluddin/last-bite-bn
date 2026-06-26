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

export const Route = createFileRoute("/merchant/edit-listing/$id")({ component: EditListing });

function toTimeInput(iso: string | null) {
  if (!iso) return "";
  try { const d = new Date(iso); return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; } catch { return ""; }
}
function toDateInput(iso: string | null) {
  if (!iso) return new Date().toISOString().slice(0, 10);
  try { return new Date(iso).toISOString().slice(0, 10); } catch { return new Date().toISOString().slice(0, 10); }
}
const dayName = (date: string) => date ? new Date(`${date}T00:00:00`).toLocaleDateString([], { weekday: "long" }) : "";
const toIso = (date: string, time: string) => date && time ? new Date(`${date}T${time}:00`).toISOString() : null;

function EditListing() {
  const { id } = Route.useParams();
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState<any>(null);
  const [listing, setListing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: rows } = await (supabase as any).rpc("get_my_merchant");
      const m = Array.isArray(rows) && rows.length ? rows[0] : null;
      setMerchant(m);
      if (m) {
        const { data: l } = await (supabase as any).from("listings").select("*").eq("id", id).maybeSingle();
        setListing(l);
        if (l) {
          setForm({
            title: l.title ?? "",
            description: l.description ?? "",
            category: l.category ?? CATEGORIES[0],
            original_price: Number(l.original_price ?? 0),
            discounted_price: Number(l.discounted_price ?? 0),
            quantity_available: Number(l.quantity_available ?? 0),
            listing_date: toDateInput(l.created_at),
            produced_date: toDateInput(l.produced_at),
            produced_time: toTimeInput(l.produced_at),
            pickup_start: toTimeInput(l.pickup_start),
            pickup_end: toTimeInput(l.pickup_end),
            allergen_info: l.allergen_info ?? "",
            images: (l.images && l.images.length ? l.images : (l.image_url ? [l.image_url] : [])) as string[],
            visible: !!l.visible,
            status: l.status ?? "active",
          });
        }
      }
    })();
  }, [user, id]);

  if (loading) return <SiteLayout><div className="p-10">Loading…</div></SiteLayout>;
  if (!isAuthenticated) return <Navigate to="/auth" search={{ redirect: `/merchant/edit-listing/${id}` }} />;
  if (merchant === null || form === null) return <SiteLayout><div className="p-10">Loading…</div></SiteLayout>;
  if (!merchant) return <Navigate to="/merchant/onboarding" />;
  if (!listing) return <SiteLayout><div className="p-10 text-center">Listing not found.</div></SiteLayout>;

  const save = async (status?: "active" | "draft") => {
    if (!form.listing_date || !form.produced_date || !form.produced_time || !form.pickup_start || !form.pickup_end) {
      toast.error("Please fill in listing date, production date/time, and pickup window.");
      return;
    }
    setSaving(true);
    const { images, listing_date, produced_date, produced_time, ...rest } = form;
    const payload: any = {
      ...rest,
      image_url: images[0] ?? null,
      images,
      created_at: new Date(`${listing_date}T00:00:00`).toISOString(),
      produced_at: toIso(produced_date, produced_time),
      pickup_start: new Date(`${listing_date}T${form.pickup_start}:00`).toISOString(),
      pickup_end: new Date(`${listing_date}T${form.pickup_end}:00`).toISOString(),
    };
    if (status) payload.status = status;
    const { error } = await (supabase as any).from("listings").update(payload).eq("id", id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Listing updated.");
    navigate({ to: "/merchant" });
  };

  const remove = async () => {
    if (!confirm("Delete this listing? This cannot be undone.")) return;
    setDeleting(true);
    const { error } = await supabase.from("listings").delete().eq("id", id);
    setDeleting(false);
    if (error) return toast.error(error.message);
    toast.success("Listing deleted.");
    navigate({ to: "/merchant" });
  };

  return (
    <SiteLayout>
      <section className="container mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-3xl font-bold">Edit listing</h1>
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
            <F label="Allergen info" full><Input value={form.allergen_info} onChange={(e) => setForm({ ...form, allergen_info: e.target.value })} /></F>
            <F label="Photos" full><ImageUpload multiple value={form.images} onChange={(v) => setForm({ ...form, images: v })} /></F>
            <div className="sm:col-span-2 flex items-center justify-between rounded-2xl bg-cream/60 p-3">
              <div><div className="font-medium">Visible to customers</div><div className="text-sm text-muted-foreground">Turn off to hide while editing.</div></div>
              <Switch checked={form.visible} onCheckedChange={(v) => setForm({ ...form, visible: v })} />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="destructive" className="rounded-full" disabled={deleting} onClick={remove}>{deleting ? "Deleting…" : "Delete"}</Button>
            <div className="flex-1" />
            {form.status === "active" ? <Button variant="outline" className="rounded-full" disabled={saving} onClick={() => save("draft")}>Unpublish</Button> : <Button variant="outline" className="rounded-full" disabled={saving} onClick={() => save("active")}>Publish</Button>}
            <Button className="rounded-full" disabled={saving} onClick={() => save()}>{saving ? "Saving…" : "Save changes"}</Button>
          </div>
        </Card>
      </section>
    </SiteLayout>
  );
}

function F({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <div className={full ? "sm:col-span-2" : ""}><Label className="mb-1.5 block text-sm">{label}</Label>{children}</div>;
}
