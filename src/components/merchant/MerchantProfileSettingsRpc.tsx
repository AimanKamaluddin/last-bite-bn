import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/upload/ImageUpload";
import { CATEGORIES, DISTRICTS } from "@/lib/sample-data";
import { updateMyMerchantProfile } from "@/lib/merchant-profile.functions";
import { ExternalLink, Save, Store } from "lucide-react";
import { toast } from "sonner";

export function MerchantProfileSettingsRpc({ merchant, onSaved }: { merchant: any; onSaved?: (merchant: any) => void }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    setForm({
      business_name: merchant?.business_name ?? "",
      tagline: merchant?.tagline ?? "",
      business_type: merchant?.business_type ?? CATEGORIES[0],
      district: merchant?.district ?? DISTRICTS[0],
      description: merchant?.description ?? "",
      image_url: merchant?.image_url ?? "",
      cover_image_url: merchant?.cover_image_url ?? "",
      address: merchant?.address ?? "",
      opening_hours: merchant?.opening_hours ?? "",
      phone: merchant?.phone ?? "",
      email: merchant?.email ?? "",
      instagram_url: merchant?.instagram_url ?? "",
      website_url: merchant?.website_url ?? "",
    });
  }, [merchant]);

  const save = async () => {
    if (!merchant?.id) return toast.error("Merchant profile not found.");
    setSaving(true);

    try {
      const savedMerchant = await updateMyMerchantProfile({
        data: {
          merchant_id: merchant.id,
          business_name: form.business_name,
          business_type: form.business_type,
          district: form.district,
          description: form.description || null,
          image_url: form.image_url || null,
          cover_image_url: form.cover_image_url || null,
          address: form.address || null,
          opening_hours: form.opening_hours || null,
          phone: form.phone || null,
          email: form.email || null,
          tagline: form.tagline || null,
          instagram_url: form.instagram_url || null,
          website_url: form.website_url || null,
        },
      });

      toast.success("Public profile updated.");
      onSaved?.({ ...merchant, ...form, ...(savedMerchant ?? {}) });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update public profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="rounded-3xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-xl font-semibold">Public profile settings</h2><p className="text-sm text-muted-foreground">Customize the details customers see on your public vendor profile.</p></div>
        <Button asChild variant="outline" className="rounded-full"><a href={`/merchant-profile/${merchant.id}`} target="_blank" rel="noreferrer"><ExternalLink className="mr-2 h-4 w-4" />View public profile</a></Button>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-5">
          <div><Label className="mb-2 block">Profile photo / logo</Label><ImageUpload value={form.image_url ?? ""} recommendedSize="800 × 800 px square image" onChange={(v) => setForm({ ...form, image_url: v })} /></div>
          <div><Label className="mb-2 block">Cover image</Label><ImageUpload value={form.cover_image_url ?? ""} recommendedSize="1600 × 600 px wide banner" onChange={(v) => setForm({ ...form, cover_image_url: v })} /></div>
          <Card className="overflow-hidden rounded-2xl p-0"><div className="h-28 bg-gradient-to-br from-primary via-emerald-600 to-accent">{form.cover_image_url && <img src={form.cover_image_url} alt="" className="h-full w-full object-cover" />}</div><div className="p-4"><div className="-mt-10 grid h-16 w-16 place-items-center overflow-hidden rounded-2xl bg-primary text-primary-foreground ring-4 ring-background">{form.image_url ? <img src={form.image_url} alt="" className="h-full w-full object-cover" /> : <Store className="h-8 w-8" />}</div><div className="mt-3 font-semibold">{form.business_name || "Your business name"}</div><div className="text-sm text-muted-foreground">{form.tagline || "Your tagline will appear here"}</div></div></Card>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Business name" full><Input value={form.business_name ?? ""} onChange={(e) => setForm({ ...form, business_name: e.target.value })} /></Field>
          <Field label="Tagline" full><Input value={form.tagline ?? ""} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></Field>
          <Field label="Business type"><Select value={form.business_type} onValueChange={(v) => setForm({ ...form, business_type: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></Field>
          <Field label="District"><Select value={form.district} onValueChange={(v) => setForm({ ...form, district: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{DISTRICTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></Field>
          <Field label="Description" full><Textarea rows={4} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <Field label="Address" full><Input value={form.address ?? ""} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
          <Field label="Opening hours" full><Input value={form.opening_hours ?? ""} onChange={(e) => setForm({ ...form, opening_hours: e.target.value })} /></Field>
          <Field label="Phone"><Input value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label="Email"><Input type="email" value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Instagram / social link"><Input value={form.instagram_url ?? ""} onChange={(e) => setForm({ ...form, instagram_url: e.target.value })} /></Field>
          <Field label="Website / menu link"><Input value={form.website_url ?? ""} onChange={(e) => setForm({ ...form, website_url: e.target.value })} /></Field>
        </div>
      </div>
      <div className="mt-6 flex justify-end"><Button onClick={save} disabled={saving} className="rounded-full"><Save className="mr-2 h-4 w-4" />{saving ? "Saving…" : "Save public profile"}</Button></div>
    </Card>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <div className={full ? "sm:col-span-2" : ""}><Label className="mb-1.5 block text-sm">{label}</Label>{children}</div>;
}