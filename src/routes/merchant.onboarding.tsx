import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "@/components/upload/ImageUpload";
import { useAuth } from "@/hooks/use-auth";
import { DISTRICTS, CATEGORIES } from "@/lib/sample-data";
import { toast } from "sonner";

export const Route = createFileRoute("/merchant/onboarding")({
  component: Onboarding,
});

const BUSINESS_TYPES = [...CATEGORIES, "Gerai"] as const;
const VENDOR_AGREEMENT_VERSION = "Last Bite Vendor Agreement v1.0 — 28 June 2026";

function Onboarding() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [existing, setExisting] = useState<any>(null);
  const [acceptedVendorAgreement, setAcceptedVendorAgreement] = useState(false);
  const [acceptedFoodSafety, setAcceptedFoodSafety] = useState(false);
  const [acceptedLicensing, setAcceptedLicensing] = useState(false);
  const [acceptedOrderHonour, setAcceptedOrderHonour] = useState(false);

  const [form, setForm] = useState({
    business_name: "",
    business_type: CATEGORIES[1] as string,
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    district: DISTRICTS[0] as string,
    business_reg_no: "",
    opening_hours: "",
    description: "",
    image_url: "",
  });

  const agreementReady = acceptedVendorAgreement && acceptedFoodSafety && acceptedLicensing && acceptedOrderHonour;

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: rows } = await (supabase as any).rpc("get_my_merchant");
      const data = Array.isArray(rows) && rows.length ? rows[0] : null;
      if (data) setExisting(data);
    })();
  }, [user]);

  if (loading) return <SiteLayout><div className="p-10">Loading…</div></SiteLayout>;
  if (!isAuthenticated) return <Navigate to="/auth" search={{ redirect: "/merchant/onboarding" }} />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!agreementReady) return toast.error("Please accept the required vendor agreement confirmations before submitting.");
    setSubmitting(true);
    const { error } = await supabase.from("merchants").insert({ ...form, user_id: user.id, email: form.email || user.email });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Application submitted! We'll review it shortly.");
    navigate({ to: "/merchant" });
  };

  if (existing) {
    return (
      <SiteLayout>
        <section className="container mx-auto max-w-xl px-4 py-12">
          <Card className="rounded-3xl p-8 text-center">
            <h1 className="text-2xl font-bold">You're already on board 🎉</h1>
            <p className="mt-2 text-muted-foreground">
              Status: <strong className="capitalize">{existing.approval_status}</strong>
            </p>
            <Button asChild className="mt-6 rounded-full">
              <a href="/merchant">Go to merchant dashboard</a>
            </Button>
          </Card>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="container mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-3xl font-bold">Join as a merchant</h1>
        <p className="mt-2 text-muted-foreground">Tell us about your business. We'll review and approve within 1–2 business days.</p>

        <Card className="mt-6 rounded-3xl p-6">
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <Field label="Business name" full><Input required value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} /></Field>
            <Field label="Business type">
              <Select value={form.business_type} onValueChange={(v) => setForm({ ...form, business_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{BUSINESS_TYPES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="District">
              <Select value={form.district} onValueChange={(v) => setForm({ ...form, district: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{DISTRICTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Contact person"><Input value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} /></Field>
            <Field label="Phone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+673" /></Field>
            <Field label="Email"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={user?.email ?? ""} /></Field>
            <Field label="Business registration #"><Input value={form.business_reg_no} onChange={(e) => setForm({ ...form, business_reg_no: e.target.value })} /></Field>
            <Field label="Address" full><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
            <Field label="Opening hours" full><Input value={form.opening_hours} onChange={(e) => setForm({ ...form, opening_hours: e.target.value })} placeholder="Mon–Sat 8am–9pm" /></Field>
            <Field label="Logo / photo" full>
              <ImageUpload value={form.image_url} recommendedSize="800 × 800 px square image" onChange={(v) => setForm({ ...form, image_url: v })} />
            </Field>
            <Field label="Short description" full><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>

            <div className="rounded-2xl border bg-muted/40 p-4 text-sm sm:col-span-2">
              <p className="mb-3 font-semibold">Required vendor agreement</p>
              <Check checked={acceptedVendorAgreement} onChange={setAcceptedVendorAgreement}>I have read and agree to the <Link to="/legal/merchant-agreement" className="font-semibold text-primary underline">Merchant Agreement</Link>.</Check>
              <Check checked={acceptedFoodSafety} onChange={setAcceptedFoodSafety}>I certify that food listed on Last Bite will comply with food safety, hygiene, allergen, storage and handling obligations.</Check>
              <Check checked={acceptedLicensing} onChange={setAcceptedLicensing}>I certify that my business holds all permits, approvals, licences and registrations required to operate and sell food in Brunei Darussalam.</Check>
              <Check checked={acceptedOrderHonour} onChange={setAcceptedOrderHonour}>I agree to honour confirmed orders, maintain accurate listings, and provide food within stated pickup windows.</Check>
              <p className="mt-3 text-xs text-muted-foreground">Agreement version: {VENDOR_AGREEMENT_VERSION}</p>
            </div>

            <div className="sm:col-span-2">
              <Button type="submit" disabled={submitting || !agreementReady} className="w-full rounded-full" size="lg">
                {submitting ? "Submitting…" : "Submit for approval"}
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </SiteLayout>
  );
}

function Check({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return <label className="mt-2 flex gap-2 leading-5"><input type="checkbox" className="mt-1" checked={checked} onChange={(e) => onChange(e.target.checked)} required /> <span>{children}</span></label>;
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <div className={full ? "sm:col-span-2" : ""}><Label className="mb-1.5 block text-sm">{label}</Label>{children}</div>;
}