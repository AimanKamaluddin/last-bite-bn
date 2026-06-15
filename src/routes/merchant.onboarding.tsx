import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { DISTRICTS, CATEGORIES, HALAL_STATUSES } from "@/lib/sample-data";
import { toast } from "sonner";

export const Route = createFileRoute("/merchant/onboarding")({
  component: Onboarding,
});

function Onboarding() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [existing, setExisting] = useState<any>(null);

  const [form, setForm] = useState({
    business_name: "",
    business_type: CATEGORIES[1],
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    district: DISTRICTS[0],
    halal_status: "halal_certified",
    business_reg_no: "",
    opening_hours: "",
    description: "",
    image_url: "",
  });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("merchants").select("*").eq("user_id", user.id).maybeSingle();
      if (data) setExisting(data);
    })();
  }, [user]);

  if (loading) return <SiteLayout><div className="p-10">Loading…</div></SiteLayout>;
  if (!isAuthenticated) return <Navigate to="/auth" search={{ redirect: "/merchant/onboarding" }} />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    const { error } = await supabase.from("merchants").insert({ ...form, user_id: user.id, email: form.email || user.email });
    // grant merchant role (RLS allows admin-only; in demo, we'd handle via server). Use insert with returning.
    if (!error) {
      await supabase.from("user_roles").insert({ user_id: user.id, role: "merchant" }).select().then(() => {/* allowed if grant exists */}).catch(() => {});
    }
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
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
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
            <Field label="Halal status">
              <Select value={form.halal_status} onValueChange={(v) => setForm({ ...form, halal_status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{HALAL_STATUSES.map((h) => <SelectItem key={h.value} value={h.value}>{h.label}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Business registration #"><Input value={form.business_reg_no} onChange={(e) => setForm({ ...form, business_reg_no: e.target.value })} /></Field>
            <Field label="Address" full><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
            <Field label="Opening hours" full><Input value={form.opening_hours} onChange={(e) => setForm({ ...form, opening_hours: e.target.value })} placeholder="Mon–Sat 8am–9pm" /></Field>
            <Field label="Logo / photo URL" full><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://…" /></Field>
            <Field label="Short description" full><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>

            <div className="sm:col-span-2">
              <Button type="submit" disabled={submitting} className="w-full rounded-full" size="lg">
                {submitting ? "Submitting…" : "Submit for approval"}
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </SiteLayout>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <div className={full ? "sm:col-span-2" : ""}><Label className="mb-1.5 block text-sm">{label}</Label>{children}</div>;
}
