import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

const searchSchema = z.object({ redirect: z.string().optional() });
const AGREEMENT_VERSION = "Last Bite Customer Terms v1.0 — 28 June 2026";

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => searchSchema.parse(s),
  component: AuthPage,
});

const cleanUsername = (value: string) => value.trim().replace(/^@+/, "");

function AuthPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/auth" });
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedMarketplace, setAcceptedMarketplace] = useState(false);

  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");

  const signupReady = acceptedTerms && acceptedPrivacy && acceptedMarketplace;

  const goAfterAuth = () => {
    navigate({ to: (redirect ?? "/dashboard") as any });
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupReady) return toast.error("Please accept the required Last Bite agreements before creating an account.");
    const finalUsername = cleanUsername(username);
    if (finalUsername.length < 3) return toast.error("Username must be at least 3 characters.");
    if (!/^[a-zA-Z0-9._-]+$/.test(finalUsername)) return toast.error("Username can only use letters, numbers, dots, underscores, and hyphens.");

    setLoading(true);
    const acceptedAt = new Date().toISOString();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          username: finalUsername,
          name,
          phone,
          display_name: finalUsername,
          legal_agreement_version: AGREEMENT_VERSION,
          legal_accepted_at: acceptedAt,
          accepted_terms: true,
          accepted_privacy_policy: true,
          accepted_marketplace_disclaimer: true,
        },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success(`Account created! Welcome, @${finalUsername}.`);
    goAfterAuth();
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: siEmail, password: siPassword });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    goAfterAuth();
  };

  const google = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    setLoading(false);
    if (result.error) return toast.error("Google sign-in failed.");
    if (result.redirected) return;
    goAfterAuth();
  };

  const forgot = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: window.location.origin + "/reset-password",
    });
    if (error) return toast.error(error.message);
    toast.success("Check your email for the reset link.");
  };

  return (
    <SiteLayout>
      <section className="container mx-auto max-w-md px-4 py-12">
        <h1 className="text-center text-3xl font-bold">Welcome to Last Bite</h1>
        <p className="mt-2 text-center text-muted-foreground">Sign in to reserve surprise bags.</p>

        <Card className="mt-6 rounded-3xl p-6">
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
              <TabsTrigger value="forgot">Forgot</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-3 pt-4">
              <Button onClick={google} variant="outline" className="w-full rounded-full" disabled={loading}>
                Continue with Google
              </Button>
              <Divider />
              <form onSubmit={signIn} className="space-y-3">
                <Field label="Email"><Input type="email" required value={siEmail} onChange={(e) => setSiEmail(e.target.value)} /></Field>
                <Field label="Password"><Input type="password" required value={siPassword} onChange={(e) => setSiPassword(e.target.value)} /></Field>
                <Button type="submit" className="w-full rounded-full" disabled={loading}>Sign in</Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-3 pt-4">
              <Button onClick={google} variant="outline" className="w-full rounded-full" disabled={loading}>
                Sign up with Google
              </Button>
              <p className="text-xs leading-5 text-muted-foreground">By using Google sign-up, you will be asked to comply with the same Last Bite customer terms, privacy policy and marketplace disclaimer.</p>
              <Divider />
              <form onSubmit={signUp} className="space-y-3">
                <Field label="Username"><Input required value={username} onChange={(e) => setUsername(cleanUsername(e.target.value))} placeholder="e.g. aiman_bn" minLength={3} pattern="[A-Za-z0-9._-]+" /></Field>
                <Field label="Name"><Input required value={name} onChange={(e) => setName(e.target.value)} /></Field>
                <Field label="Phone"><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+673 ..." /></Field>
                <Field label="Email"><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
                <Field label="Password"><Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} /></Field>
                <AgreementChecks
                  acceptedTerms={acceptedTerms}
                  setAcceptedTerms={setAcceptedTerms}
                  acceptedPrivacy={acceptedPrivacy}
                  setAcceptedPrivacy={setAcceptedPrivacy}
                  acceptedMarketplace={acceptedMarketplace}
                  setAcceptedMarketplace={setAcceptedMarketplace}
                />
                <Button type="submit" className="w-full rounded-full" disabled={loading || !signupReady}>Create account</Button>
              </form>
            </TabsContent>

            <TabsContent value="forgot" className="space-y-3 pt-4">
              <form onSubmit={forgot} className="space-y-3">
                <Field label="Email"><Input type="email" required value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} /></Field>
                <Button type="submit" className="w-full rounded-full">Send reset link</Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </section>
    </SiteLayout>
  );
}

function AgreementChecks({ acceptedTerms, setAcceptedTerms, acceptedPrivacy, setAcceptedPrivacy, acceptedMarketplace, setAcceptedMarketplace }: { acceptedTerms: boolean; setAcceptedTerms: (v: boolean) => void; acceptedPrivacy: boolean; setAcceptedPrivacy: (v: boolean) => void; acceptedMarketplace: boolean; setAcceptedMarketplace: (v: boolean) => void }) {
  return (
    <div className="rounded-2xl border bg-muted/40 p-4 text-sm">
      <p className="mb-3 font-semibold">Required customer agreement</p>
      <Check checked={acceptedTerms} onChange={setAcceptedTerms}>I have read and agree to the <Link to="/legal/terms" className="font-semibold text-primary underline">Terms & Conditions</Link>.</Check>
      <Check checked={acceptedPrivacy} onChange={setAcceptedPrivacy}>I acknowledge the <Link to="/legal/privacy" className="font-semibold text-primary underline">Privacy Policy</Link>.</Check>
      <Check checked={acceptedMarketplace} onChange={setAcceptedMarketplace}>I understand Last Bite is a marketplace, not the food seller, and food is supplied by independent vendors.</Check>
      <p className="mt-3 text-xs text-muted-foreground">Agreement version: {AGREEMENT_VERSION}</p>
    </div>
  );
}

function Check({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return <label className="mt-2 flex gap-2 leading-5"><input type="checkbox" className="mt-1" checked={checked} onChange={(e) => onChange(e.target.checked)} required /> <span>{children}</span></label>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="mb-1.5 block text-sm">{label}</Label>{children}</div>;
}

function Divider() {
  return (
    <div className="flex items-center gap-3 py-1 text-xs text-muted-foreground">
      <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
    </div>
  );
}
