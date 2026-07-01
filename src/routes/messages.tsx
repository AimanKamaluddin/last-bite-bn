import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Send, ShieldAlert, Store, UserRound } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/messages")({ component: Messages });

type Thread = {
  id: string;
  buyer_id: string;
  merchant_id: string;
  status: string;
  last_message_at: string;
  created_at: string;
  merchant?: { id: string; business_name: string; district?: string | null; image_url?: string | null } | null;
  buyer?: { id: string; name?: string | null } | null;
};

type Message = {
  id: string;
  thread_id: string;
  sender_id: string;
  body: string;
  read_at?: string | null;
  created_at: string;
};

function Messages() {
  const { user, isAuthenticated, loading } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [myMerchant, setMyMerchant] = useState<any>(null);
  const [busy, setBusy] = useState(true);
  const [sending, setSending] = useState(false);
  const [draft, setDraft] = useState("");

  const targetMerchantId = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("merchant_id") ?? "";
  }, []);

  const activeThread = threads.find((thread) => thread.id === activeThreadId) ?? null;
  const viewingAsMerchant = !!activeThread && activeThread.merchant_id === myMerchant?.id;

  const getThreadTitle = (thread: Thread) => {
    if (thread.merchant_id === myMerchant?.id) return thread.buyer?.name || "Customer";
    return thread.merchant?.business_name || "Merchant";
  };

  const getThreadSubtitle = (thread: Thread) => {
    if (thread.merchant_id === myMerchant?.id) return thread.merchant?.business_name || "Vendor inbox";
    return thread.merchant?.district || "Vendor chat";
  };

  const loadThreads = useCallback(async () => {
    if (!user) return;
    setBusy(true);

    const { data: myMerchantRows } = await (supabase as any).rpc("get_my_merchant");
    const merchantAccount = Array.isArray(myMerchantRows) && myMerchantRows.length ? myMerchantRows[0] : null;
    setMyMerchant(merchantAccount);

    let openedThread: any | null = null;
    if (targetMerchantId && targetMerchantId !== merchantAccount?.id) {
      const existing = await (supabase as any)
        .from("open_chat_threads")
        .select("*")
        .eq("buyer_id", user.id)
        .eq("merchant_id", targetMerchantId)
        .maybeSingle();

      if (existing.data) {
        openedThread = existing.data;
      } else {
        const created = await (supabase as any)
          .from("open_chat_threads")
          .insert({ buyer_id: user.id, merchant_id: targetMerchantId })
          .select("*")
          .single();
        if (created.error) toast.error(created.error.message);
        openedThread = created.data ?? null;
      }
    }

    const buyerThreadsQuery = (supabase as any)
      .from("open_chat_threads")
      .select("*")
      .eq("buyer_id", user.id)
      .order("last_message_at", { ascending: false });

    const sellerThreadsQuery = merchantAccount
      ? (supabase as any).from("open_chat_threads").select("*").eq("merchant_id", merchantAccount.id).order("last_message_at", { ascending: false })
      : Promise.resolve({ data: [] as any[], error: null });

    const [{ data: buyerThreads, error: buyerError }, { data: sellerThreads, error: sellerError }] = await Promise.all([buyerThreadsQuery, sellerThreadsQuery]);

    if (buyerError) toast.error(buyerError.message);
    if (sellerError) toast.error(sellerError.message);

    const uniqueThreads = new Map<string, Thread>();
    [...(buyerThreads ?? []), ...(sellerThreads ?? []), ...(openedThread ? [openedThread] : [])].forEach((thread: any) => uniqueThreads.set(thread.id, thread));

    const rows = [...uniqueThreads.values()].sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());
    const merchantIds = [...new Set(rows.map((thread) => thread.merchant_id).filter(Boolean))];
    const buyerIds = [...new Set(rows.map((thread) => thread.buyer_id).filter(Boolean))];

    const [{ data: merchantRows }, { data: profileRows }] = await Promise.all([
      merchantIds.length ? (supabase as any).from("merchants_public").select("id, business_name, district, image_url").in("id", merchantIds) : Promise.resolve({ data: [] as any[] }),
      buyerIds.length ? (supabase as any).from("profiles").select("id, name").in("id", buyerIds) : Promise.resolve({ data: [] as any[] }),
    ]);

    const merchantById = new Map((merchantRows ?? []).map((merchant: any) => [merchant.id, merchant]));
    const buyerById = new Map((profileRows ?? []).map((profile: any) => [profile.id, profile]));
    const hydrated = rows.map((thread) => ({ ...thread, merchant: (merchantById.get(thread.merchant_id) as any) ?? null, buyer: (buyerById.get(thread.buyer_id) as any) ?? null }));

    setThreads(hydrated as Thread[]);
    setActiveThreadId((current) => openedThread?.id ?? current ?? hydrated[0]?.id ?? null);
    setBusy(false);
  }, [targetMerchantId, user]);

  const loadMessages = useCallback(async (threadId: string) => {
    const { data, error } = await (supabase as any)
      .from("open_chat_messages")
      .select("*")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true })
      .limit(100);

    if (error) {
      toast.error(error.message);
      setMessages([]);
      return;
    }

    setMessages(data ?? []);

    if (user) {
      await (supabase as any)
        .from("open_chat_messages")
        .update({ read_at: new Date().toISOString() })
        .eq("thread_id", threadId)
        .neq("sender_id", user.id)
        .is("read_at", null);
    }
  }, [user]);

  useEffect(() => { if (user) loadThreads(); }, [loadThreads, user]);
  useEffect(() => { if (activeThreadId) loadMessages(activeThreadId); else setMessages([]); }, [activeThreadId, loadMessages]);

  useEffect(() => {
    if (!activeThreadId) return;
    const channel = supabase
      .channel(`open-chat-${activeThreadId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "open_chat_messages", filter: `thread_id=eq.${activeThreadId}` }, (payload) => {
        setMessages((current) => current.some((message) => message.id === (payload.new as any).id) ? current : [...current, payload.new as Message]);
        loadThreads();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeThreadId, loadThreads]);

  const send = async () => {
    if (!activeThread || !user || !draft.trim()) return;
    setSending(true);
    const { error } = await (supabase as any).from("open_chat_messages").insert({ thread_id: activeThread.id, sender_id: user.id, body: draft.trim() });
    setSending(false);
    if (error) return toast.error(error.message);
    setDraft("");
    loadMessages(activeThread.id);
    loadThreads();
  };

  if (loading) return <SiteLayout><div className="container mx-auto p-10">Loading…</div></SiteLayout>;
  if (!isAuthenticated) return <Navigate to="/auth" search={{ redirect: targetMerchantId ? `/messages?merchant_id=${targetMerchantId}` : "/messages" }} />;

  return (
    <SiteLayout>
      <section className="container mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Messages</h1>
            <p className="mt-1 text-sm text-muted-foreground">Open buyer-to-vendor chat for questions before pickup.</p>
          </div>
          <Badge variant="secondary" className="rounded-full">{threads.length} chat{threads.length === 1 ? "" : "s"}</Badge>
        </div>

        <Card className="grid min-h-[640px] overflow-hidden rounded-3xl p-0 md:grid-cols-[320px_1fr]">
          <aside className="border-b bg-muted/30 p-3 md:border-b-0 md:border-r">
            <div className="mb-3 rounded-2xl bg-background p-3 text-xs leading-5 text-muted-foreground shadow-sm">
              <div className="flex items-center gap-2 font-bold text-foreground"><ShieldAlert className="h-4 w-4 text-primary" />Chat safely</div>
              Keep conversations about orders, pickup, allergens, and merchant questions.
            </div>
            {busy ? <div className="grid gap-2">{[1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />)}</div> : threads.length === 0 ? <EmptyInbox /> : <div className="grid gap-2">{threads.map((thread) => <button key={thread.id} type="button" onClick={() => setActiveThreadId(thread.id)} className={`rounded-2xl p-3 text-left transition ${thread.id === activeThreadId ? "bg-primary text-primary-foreground shadow-md" : "bg-background hover:bg-muted"}`}><div className="flex items-center gap-3"><Avatar thread={thread} merchantView={thread.merchant_id === myMerchant?.id} /><div className="min-w-0"><div className="truncate text-sm font-black">{getThreadTitle(thread)}</div><div className={`truncate text-xs ${thread.id === activeThreadId ? "text-primary-foreground/75" : "text-muted-foreground"}`}>{getThreadSubtitle(thread)}</div></div></div></button>)}</div>}
          </aside>

          <div className="flex min-h-[640px] flex-col">
            {!activeThread ? <div className="grid flex-1 place-items-center p-8 text-center"><div><Store className="mx-auto h-12 w-12 text-muted-foreground" /><h2 className="mt-3 text-xl font-bold">No chat selected</h2><p className="mt-1 text-sm text-muted-foreground">Open a merchant profile and tap Message vendor to start a conversation.</p><Button asChild className="mt-4 rounded-full"><Link to="/browse">Browse merchants</Link></Button></div></div> : <>
              <div className="border-b p-4">
                <div className="flex items-center gap-3">
                  <Avatar thread={activeThread} merchantView={viewingAsMerchant} large />
                  <div>
                    <h2 className="font-black leading-tight">{getThreadTitle(activeThread)}</h2>
                    <p className="text-xs text-muted-foreground">{viewingAsMerchant ? "Customer conversation" : "Vendor conversation"}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto bg-muted/20 p-3 sm:p-4">
                {messages.length === 0 ? <div className="mx-auto mt-16 max-w-sm rounded-3xl bg-background p-6 text-center shadow-sm"><h3 className="font-bold">Start the conversation</h3><p className="mt-1 text-sm text-muted-foreground">Ask about pickup, food details, allergens, availability, or location.</p></div> : messages.map((message) => {
                  const mine = message.sender_id === user?.id;
                  return <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}><div className={`max-w-[82%] rounded-3xl px-4 py-2.5 text-sm shadow-sm ${mine ? "bg-primary text-primary-foreground" : "bg-background"}`}><p className="whitespace-pre-wrap leading-6">{message.body}</p><div className={`mt-1 text-[10px] ${mine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{formatMessageTime(message.created_at)}</div></div></div>;
                })}
              </div>

              <div className="border-t bg-background p-3 sm:p-4">
                <div className="flex gap-2">
                  <Textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={2} maxLength={1000} placeholder="Type your message…" className="max-h-32 min-h-12 resize-none rounded-2xl" onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(); } }} />
                  <Button className="h-auto rounded-2xl px-4" disabled={sending || !draft.trim()} onClick={send} aria-label="Send message"><Send className="h-4 w-4" /></Button>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">Do not share passwords, bank details, or sensitive personal information in chat.</p>
              </div>
            </>}
          </div>
        </Card>
      </section>
    </SiteLayout>
  );
}

function Avatar({ thread, merchantView, large }: { thread: Thread; merchantView: boolean; large?: boolean }) {
  const size = large ? "h-12 w-12" : "h-10 w-10";
  if (merchantView) return <div className={`${size} grid shrink-0 place-items-center rounded-full bg-primary/10 text-primary`}><UserRound className="h-5 w-5" /></div>;
  return <div className={`${size} grid shrink-0 place-items-center overflow-hidden rounded-full bg-primary/10 text-primary`}>{thread.merchant?.image_url ? <img src={thread.merchant.image_url} alt="" className="h-full w-full object-cover" /> : <Store className="h-5 w-5" />}</div>;
}

function EmptyInbox() {
  return <div className="rounded-3xl bg-background p-6 text-center shadow-sm"><Store className="mx-auto h-10 w-10 text-muted-foreground" /><h2 className="mt-3 font-bold">No messages yet</h2><p className="mt-1 text-sm text-muted-foreground">Start from a merchant profile.</p><Button asChild className="mt-4 rounded-full" size="sm"><Link to="/browse">Browse food</Link></Button></div>;
}

function formatMessageTime(value: string) {
  try { return new Date(value).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }); } catch { return ""; }
}
