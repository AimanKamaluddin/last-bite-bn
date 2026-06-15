import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({ component: Reset });

function Reset() {
  const [password, setPassword] = useState("");
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase parses the recovery token automatically. We just enable the form once a session is present.
    supabase.auth.getSession().then(({ data }) => setReady(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setReady(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return toast.error(error.message);
    toast.success("Password updated. You're signed in.");
    navigate({ to: "/dashboard" });
  };

  return (
    <SiteLayout>
      <section className="container mx-auto max-w-md px-4 py-12">
        <Card className="rounded-3xl p-6">
          <h1 className="text-2xl font-bold">Set a new password</h1>
          {!ready ? (
            <p className="mt-3 text-sm text-muted-foreground">Open the reset link from your email to continue.</p>
          ) : (
            <form onSubmit={submit} className="mt-4 space-y-3">
              <Label className="text-sm">New password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
              <Button type="submit" className="w-full rounded-full">Update password</Button>
            </form>
          )}
        </Card>
      </section>
    </SiteLayout>
  );
}
