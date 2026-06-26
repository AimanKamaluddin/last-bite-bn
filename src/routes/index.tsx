import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteLayout } from "@/components/site/SiteLayout";
import { AdSlot } from "@/components/ads/AdSlot";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ListingCard, type ListingCardData } from "@/components/listings/ListingCard";
import { formatBND } from "@/lib/sample-data";
import { ArrowRight, Clock, Coffee, CupSoda, Flame, HandCoins, Leaf, MapPin, PackageSearch, Search, ShoppingBag, Sparkles, Store, Timer, TrendingUp, Utensils } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [ { title: "Last Bite — Rescue food before it's gone" }, { name: "description", content: "Brunei's surplus food marketplace. Reserve discounted meals, drinks, bakery items and desserts before pickup windows end." }, { property: "og:title", content: "Last Bite — Rescue food before it's gone" }, { property: "og:description", content: "Find food available today from local Brunei businesses." } ] }),
  component: Landing
});

const isExpired = (pickupEnd: string) => {
  const end = new Date(pickupEnd);
  return !Number.isNaN(end.getTime()) && end.getTime() < Date.now();
};

const minutesUntil = (dateValue: string) => {
  const end = new Date(dateValue);
  if (Number.isNaN(end.getTime())) return Number.POSITIVE_INFINITY;
  return Math.max(0, Math.round((end.getTime() - Date.now()) / 60000));
};

const urgencyLabel = (listing: ListingCardData) => {
  const mins = minutesUntil(listing.pickup_end);
  if (mins === Number.POSITIVE_INFINITY) return "Pickup today";
  if (mins < 60) return `Ends in ${mins} min`;
  const hours = Math.floor(mins / 60);
  return `Ends in ${hours}h ${mins % 60}m`;
};

function Landing() {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [listings, setListings] = useState<ListingCardData[]>([]);

  useEffect(() => { (async () => {
    const [{ data: m }, { data: l }] = await Promise.all([
      (supabase as any).from("merchants_public").select("id, business_name, business_type, district, image_url, rating").order("created_at", { ascending: false }).limit(6),
      (supabase as any).from("listings").select("*, merchants_public!inner(business_name, district, rating)").eq("visible", true).eq("status", "active").order("created_at", { ascending: false }).limit(24),
    ]);
    setMerchants(m ?? []);
    setListings((l ?? []).map((d: any) => ({ id: d.id, title: d.title, category: d.category, original_price: Number(d.original_price), discounted_price: Number(d.discounted_price), quantity_available: d.quantity_available, pickup_start: d.pickup_start, pickup_end: d.pickup_end, created_at: d.created_at, produced_at: d.produced_at, image_url: d.image_url || "", merchant: { business_name: d.merchants_public?.business_name ?? "", district: d.merchants_public?.district ?? "", rating: Number(d.merchants_public?.rating ?? 0) } })));
  })(); }, []);

  const liveListings = useMemo(() => listings.filter((l) => !isExpired(l.pickup_end) && l.quantity_available > 0), [listings]);
  const availableNow = useMemo(() => [...liveListings].sort((a, b) => minutesUntil(a.pickup_end) - minutesUntil(b.pickup_end) || a.quantity_available - b.quantity_available).slice(0, 6), [liveListings]);
  const sellingFast = useMemo(() => [...liveListings].sort((a, b) => a.quantity_available - b.quantity_available || minutesUntil(a.pickup_end) - minutesUntil(b.pickup_end)).slice(0, 3), [liveListings]);
  const underFive = liveListings.filter((l) => l.discounted_price <= 5).length;
  const offersAvailable = liveListings.reduce((sum, l) => sum + Number(l.quantity_available || 0), 0);
  const customerSavings = liveListings.reduce((sum, l) => sum + Math.max(0, l.original_price - l.discounted_price) * Number(l.quantity_available || 0), 0);

  return <SiteLayout>
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto grid items-center gap-10 px-4 pb-10 pt-8 md:grid-cols-[1.05fr_0.95fr] md:pb-14 md:pt-12">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium shadow-sm"><Sparkles className="h-3.5 w-3.5 text-accent" /> Food available today in Brunei</span>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.02] md:text-6xl">Rescue delicious food <span className="text-primary">before it&apos;s gone.</span></h1>
            <p className="max-w-xl text-lg text-muted-foreground">Find surplus meals, bakery items, desserts, coffee and drinks from local businesses. Reserve in seconds, collect during the pickup window.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full"><Link to="/browse"><ShoppingBag className="mr-2 h-4 w-4" /> Reserve Now</Link></Button>
            <Button asChild size="lg" variant="outline" className="rounded-full"><Link to="/merchant/onboarding"><Store className="mr-2 h-4 w-4" /> Join as Merchant</Link></Button>
          </div>
          <div className="grid gap-3 pt-1 text-sm sm:grid-cols-3">
            <HeroProof icon={Timer} title="Pickup today" body="Short pickup windows." />
            <HeroProof icon={HandCoins} title="Pay less" body="Discounted local food." />
            <HeroProof icon={Leaf} title="Waste less" body="Give good food another chance." />
          </div>
        </div>

        <div className="relative">
          <AdSlot size="billboard" id="ad-space-01-home-hero" slotCode="AD SPACE 01" label="AD SPACE 01 homepage hero" className="h-full min-h-[360px] md:min-h-[460px]" />
        </div>
      </div>
    </section>

    <section className="container mx-auto px-4 py-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        <QuickChip icon={Flame} label="Available Now" />
        <QuickChip icon={Coffee} label="Coffee" />
        <QuickChip icon={PackageSearch} label="Bakery" />
        <QuickChip icon={Utensils} label="Meals" />
        <QuickChip icon={Sparkles} label="Desserts" />
        <QuickChip icon={CupSoda} label="Drinks" />
        <QuickChip icon={HandCoins} label="Under BND 5" count={underFive} />
        <QuickChip icon={TrendingUp} label="Highest Discount" />
        <QuickChip icon={MapPin} label="Near Me" />
      </div>
    </section>

    <section className="container mx-auto px-4 pb-8">
      <div className="grid gap-3 sm:grid-cols-3">
        <MarketStat label="Offers available now" value={offersAvailable} />
        <MarketStat label="Live offers today" value={liveListings.length} />
        <MarketStat label="Possible customer savings" value={formatBND(customerSavings)} />
      </div>
    </section>

    {availableNow.length > 0 && <Section title="Available right now" subtitle="Reserve before the pickup window closes." action={<Button asChild variant="outline" className="rounded-full"><Link to="/browse">Browse all <ArrowRight className="h-4 w-4" /></Link></Button>}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{availableNow.map((l) => <div key={l.id} className="relative"><div className="absolute left-3 top-3 z-10 rounded-full bg-background/95 px-3 py-1 text-xs font-semibold shadow"><Clock className="mr-1 inline h-3.5 w-3.5 text-primary" />{urgencyLabel(l)}</div><ListingCard listing={l} /></div>)}</div>
    </Section>}

    <div className="container mx-auto px-4 py-2"><AdSlot size="inline" id="ad-space-02-home-after-offers" slotCode="AD SPACE 02" label="AD SPACE 02 homepage after offers" /></div>

    {sellingFast.length > 0 && <Section title="Selling fast" subtitle="Limited quantities available.">
      <div className="grid gap-4 md:grid-cols-3">{sellingFast.map((l) => <Link key={l.id} to="/listing/$id" params={{ id: l.id }} className="group block rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"><Card className="overflow-hidden rounded-3xl p-0 transition group-hover:-translate-y-1 group-hover:shadow-lg"><div className="relative h-44 overflow-hidden">{l.image_url ? <img src={l.image_url} alt={l.title} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" /> : <div className="h-full w-full bg-muted" />}<Badge className="absolute left-3 top-3 rounded-full bg-accent text-accent-foreground"><Flame className="mr-1 h-3.5 w-3.5" /> Only {l.quantity_available} left</Badge></div><div className="p-4"><div className="font-semibold group-hover:text-primary">{l.title}</div><div className="text-sm text-muted-foreground">{l.merchant.business_name} · {urgencyLabel(l)}</div><div className="mt-4 flex items-end justify-between"><div><div className="text-xs text-muted-foreground line-through">{formatBND(l.original_price)}</div><div className="text-2xl font-bold text-primary">{formatBND(l.discounted_price)}</div></div><span className="text-sm font-semibold text-primary">Reserve →</span></div></div></Card></Link>)}</div>
    </Section>}

    <Section title="How it works" subtitle="Choose an offer, reserve it, and collect during the pickup window."><div className="grid gap-6 md:grid-cols-3">{[{ icon: Search, title: "Discover", body: "See food available today." }, { icon: ShoppingBag, title: "Reserve", body: "Choose an offer and get your pickup code." }, { icon: HandCoins, title: "Collect & enjoy", body: "Drop by during the pickup window and show your code." }].map((s) => <Card key={s.title} className="rounded-3xl border-border/60 p-6"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground"><s.icon className="h-6 w-6" /></div><h3 className="mt-4 text-lg font-semibold">{s.title}</h3><p className="mt-1 text-sm text-muted-foreground">{s.body}</p></Card>)}</div></Section>

    {merchants.length > 0 && <Section title="Featured merchants" subtitle="Local businesses offering surplus food today."><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{merchants.map((m) => <Link key={m.id} to="/merchant-profile/$id" params={{ id: m.id }} className="group block rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"><Card className="overflow-hidden rounded-3xl p-0 transition group-hover:-translate-y-1 group-hover:shadow-lg">{m.image_url ? <img src={m.image_url} alt={m.business_name} loading="lazy" className="h-36 w-full object-cover transition group-hover:scale-105" /> : <div className="h-36 w-full bg-muted" />}<div className="p-4"><div className="flex items-center justify-between gap-3"><div className="font-semibold group-hover:text-primary">{m.business_name}</div>{m.rating != null && <Badge variant="secondary" className="rounded-full">★ {Number(m.rating).toFixed(1)}</Badge>}</div><div className="mt-1 text-sm text-muted-foreground">{m.business_type} · {m.district}</div><div className="mt-3 text-xs font-medium text-primary">View today&apos;s offers →</div></div></Card></Link>)}</div></Section>}

    <Section title="Why people love Last Bite"><div className="grid gap-6 md:grid-cols-2"><BenefitCard title="For customers" items={["See available food immediately", "Reserve before pickup windows close", "Discover new local favourites", "Save money on meals, drinks and desserts"]} /><BenefitCard title="For businesses" items={["List unsold inventory quickly", "Reach nearby customers", "Reduce food waste", "Simple dashboard, no extra hardware"]} /></div></Section>

    <div className="container mx-auto px-4 py-2"><AdSlot size="leaderboard" id="ad-space-03-home-lower" slotCode="AD SPACE 03" label="AD SPACE 03 homepage lower" /></div>

    <Section title="Food waste impact"><Card className="overflow-hidden rounded-3xl border-border/60 bg-primary p-8 text-primary-foreground md:p-12"><div className="max-w-3xl"><h3 className="text-2xl font-bold md:text-3xl">Small choices can reduce food waste.</h3><p className="mt-3 text-primary-foreground/85">Last Bite connects customers with surplus food from local businesses, making it easier to support merchants while giving good food another chance.</p></div></Card></Section>

    <Section title="Frequently asked questions"><div className="mx-auto max-w-3xl"><Accordion type="single" collapsible className="w-full">{[{ q: "Is the food safe to eat?", a: "Merchants are responsible for listing food that is safe to eat and within collection windows, including any allergen information customers need." }, { q: "What kind of food can I reserve?", a: "It depends on what each merchant has available. It could be a single item, a meal, a drink, a dessert, or a bundle." }, { q: "How do I pay?", a: "For now, payment is made directly to the merchant during pickup." }, { q: "Can I cancel a reservation?", a: "You can cancel before collection, but please only reserve food you intend to pick up." }].map((f, i) => <AccordionItem key={i} value={`q-${i}`}><AccordionTrigger>{f.q}</AccordionTrigger><AccordionContent>{f.a}</AccordionContent></AccordionItem>)}</Accordion></div></Section>
  </SiteLayout>;
}

function HeroProof({ icon: Icon, title, body }: { icon: any; title: string; body: string }) { return <div className="rounded-2xl border bg-background/70 p-3 shadow-sm"><div className="flex items-center gap-2 font-semibold text-foreground"><Icon className="h-4 w-4 text-primary" />{title}</div><div className="mt-1 text-xs text-muted-foreground">{body}</div></div>; }
function QuickChip({ icon: Icon, label, count }: { icon: any; label: string; count?: number }) { return <Button asChild variant="outline" className="shrink-0 rounded-full"><Link to="/browse"><Icon className="h-4 w-4" />{label}{typeof count === "number" && count > 0 ? <span className="ml-1 rounded-full bg-primary/10 px-1.5 text-xs text-primary">{count}</span> : null}</Link></Button>; }
function MarketStat({ label, value }: { label: string; value: ReactNode }) { return <Card className="rounded-3xl p-5"><div className="text-2xl font-bold text-primary">{value}</div><div className="text-sm text-muted-foreground">{label}</div></Card>; }
function Section({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode }) { return <section className="container mx-auto px-4 py-12 md:py-16"><div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div className="max-w-2xl"><h2 className="text-3xl font-bold md:text-4xl">{title}</h2>{subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}</div>{action}</div>{children}</section>; }
function BenefitCard({ title, items }: { title: string; items: string[] }) { return <Card className="rounded-3xl p-6"><h3 className="text-xl font-semibold">{title}</h3><ul className="mt-4 space-y-3 text-sm">{items.map((it) => <li key={it} className="flex items-start gap-2"><TrendingUp className="mt-0.5 h-4 w-4 text-primary" /><span>{it}</span></li>)}</ul></Card>; }
