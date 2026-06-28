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
import { PickupWindowAlert } from "@/components/orders/PickupWindowAlert";
import { formatBND } from "@/lib/sample-data";
import { useLanguage } from "@/lib/i18n";
import { ArrowRight, Clock, Flame, HandCoins, Leaf, MapPin, PackageSearch, Search, ShoppingBag, Sparkles, Store, Timer, TrendingUp, Utensils } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [ { title: "Last Bite — Rescue food before it's gone" }, { name: "description", content: "Brunei's surplus food marketplace for desserts, pastries, bakery items and meals before pickup windows end." }, { property: "og:title", content: "Last Bite — Rescue food before it's gone" }, { property: "og:description", content: "Find desserts, pastries, bakery items and meals available today from local Brunei businesses." } ] }),
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

const formatDuration = (mins: number) => {
  if (mins === Number.POSITIVE_INFINITY) return "today";
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ${mins % 60}m`;
};

const urgencyLabel = (listing: ListingCardData) => {
  const minsToStart = minutesUntil(listing.pickup_start);
  const minsToEnd = minutesUntil(listing.pickup_end);
  if (minsToStart === Number.POSITIVE_INFINITY && minsToEnd === Number.POSITIVE_INFINITY) return "Pickup today";
  if (minsToStart > 0) return `Pickup starts in ${formatDuration(minsToStart)}`;
  return `Pickup ends in ${formatDuration(minsToEnd)}`;
};

function Landing() {
  const { t } = useLanguage();
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
  const heroListing = liveListings[0];
  const availableNow = useMemo(() => [...liveListings].sort((a, b) => minutesUntil(a.pickup_end) - minutesUntil(b.pickup_end) || a.quantity_available - b.quantity_available).slice(0, 6), [liveListings]);
  const sellingFast = useMemo(() => [...liveListings].sort((a, b) => a.quantity_available - b.quantity_available || minutesUntil(a.pickup_end) - minutesUntil(b.pickup_end)).slice(0, 3), [liveListings]);
  const underFive = liveListings.filter((l) => l.discounted_price <= 5).length;

  return <SiteLayout>
    <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_10%_10%,hsl(var(--accent)/0.22),transparent_28%),radial-gradient(circle_at_88%_12%,hsl(var(--primary)/0.18),transparent_30%),linear-gradient(180deg,hsl(var(--cream)),hsl(var(--background)))]">
      <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="container relative mx-auto grid items-center gap-8 px-3 pb-10 pt-8 sm:px-4 md:grid-cols-[1.02fr_0.98fr] md:gap-12 md:pb-16 md:pt-14">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/75 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary shadow-sm backdrop-blur"><Sparkles className="h-3.5 w-3.5 text-accent" /> {t("foodAvailableToday")}</span>
          <div className="space-y-4">
            <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.055em] text-foreground sm:text-6xl md:text-7xl">{t("heroTitleStart")} <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">{t("heroTitleHighlight")}</span></h1>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg md:text-xl">{t("heroBody")}</p>
          </div>
          <div className="grid gap-3 sm:flex sm:flex-wrap">
            <Button asChild size="lg" className="h-13 rounded-full px-6 text-base shadow-xl shadow-primary/20 transition hover:-translate-y-0.5"><Link to="/browse"><ShoppingBag className="mr-2 h-4 w-4" /> {t("reserveNow")}</Link></Button>
            <Button asChild size="lg" variant="outline" className="h-13 rounded-full border-primary/20 bg-white/70 px-6 text-base backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"><Link to="/merchant/onboarding"><Store className="mr-2 h-4 w-4" /> {t("joinAsMerchant")}</Link></Button>
          </div>
          <div className="grid gap-3 pt-2 sm:grid-cols-3">
            <HeroProof icon={Timer} title={t("pickupToday")} body={t("shortPickupWindows")} />
            <HeroProof icon={HandCoins} title={t("payLess")} body={t("discountedLocalFood")} />
            <HeroProof icon={Leaf} title={t("wasteLess")} body={t("giveGoodFoodChance")} />
          </div>
        </div>

        <div className="relative min-h-[420px] md:min-h-[560px]">
          <div className="absolute left-0 top-8 z-10 rounded-3xl border border-white/70 bg-white/80 p-4 shadow-2xl shadow-primary/10 backdrop-blur md:left-2">
            <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-accent-foreground"><Flame className="h-5 w-5" /></div><div><div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Today only</div><div className="text-lg font-black">Pastries & meals up to 60% off</div></div></div>
          </div>
          <Link to={heroListing ? "/listing/$id" : "/browse"} params={heroListing ? { id: heroListing.id } : undefined as any} className="group absolute inset-x-4 top-0 block overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_35px_100px_-40px_hsl(var(--primary)/0.95)] transition hover:-translate-y-1 hover:shadow-[0_45px_120px_-45px_hsl(var(--primary)/1)] md:inset-x-12 md:rounded-[2.5rem]">
            <div className="relative h-[390px] overflow-hidden md:h-[520px]">
              {heroListing?.image_url ? <img src={heroListing.image_url} alt={heroListing.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_25%_20%,hsl(var(--accent)/0.35),transparent_25%),linear-gradient(135deg,hsl(var(--primary)/0.88),hsl(var(--accent)/0.85))]"><Utensils className="h-28 w-28 text-white/85" /></div>}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/5" />
              <div className="absolute left-5 right-5 top-5 flex items-center justify-between"><Badge className="rounded-full bg-white px-4 py-1.5 text-primary shadow-md">Kitchen rescue pick</Badge><Badge className="rounded-full bg-black/25 px-4 py-1.5 text-white backdrop-blur ring-1 ring-white/25"><Clock className="mr-1 h-3.5 w-3.5" /> {heroListing ? urgencyLabel(heroListing) : "Available today"}</Badge></div>
              <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
                <div className="mb-3 flex flex-wrap gap-2"><span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">Desserts</span><span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">Pastries</span><span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">Meals</span></div>
                <h2 className="text-3xl font-black leading-tight sm:text-5xl">{heroListing?.title ?? "Fresh pastry and meal bags"}</h2>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>{heroListing ? <><div className="text-sm text-white/70 line-through">{formatBND(heroListing.original_price)}</div><div className="text-4xl font-black text-white">{formatBND(heroListing.discounted_price)}</div></> : <div className="text-3xl font-black">From BND 3</div>}<div className="mt-1 text-sm text-white/75">{heroListing?.merchant.business_name ?? "Local bakeries, dessert shops and kitchens"}</div></div>
                  <span className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-black text-primary shadow-sm transition group-hover:translate-x-1">Reserve →</span>
                </div>
              </div>
            </div>
          </Link>
          <div className="absolute bottom-2 right-0 rounded-3xl border border-white/70 bg-white/85 p-4 shadow-2xl shadow-accent/10 backdrop-blur md:right-4">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Live now</div>
            <div className="mt-1 text-3xl font-black text-primary">{liveListings.length}</div>
            <div className="text-xs text-muted-foreground">food deals near you</div>
          </div>
        </div>
      </div>
    </section>

    <section className="container mx-auto px-3 py-5 sm:px-4 sm:py-7">
      <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <QuickChip icon={Flame} label={t("availableNow")} />
        <QuickChip icon={PackageSearch} label={t("bakery")} />
        <QuickChip icon={Sparkles} label={t("desserts")} />
        <QuickChip icon={Utensils} label={t("meals")} />
        <QuickChip icon={HandCoins} label={t("underBndFive")} count={underFive} />
        <QuickChip icon={TrendingUp} label={t("highestDiscount")} />
        <QuickChip icon={MapPin} label={t("nearMe")} />
      </div>
    </section>

    {availableNow.length > 0 && <Section eyebrow="Fresh drops" title="Today's dessert, pastry & food deals" notice={<PickupWindowAlert compact />} action={<Button asChild variant="outline" className="rounded-full bg-white/70"><Link to="/browse">{t("browseAll")} <ArrowRight className="h-4 w-4" /></Link></Button>}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{availableNow.map((l) => <div key={l.id} className="group rounded-[1.6rem] bg-gradient-to-b from-white to-white/70 p-2 shadow-sm ring-1 ring-border/70 transition hover:-translate-y-1 hover:shadow-xl"><div className="mb-2 flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-2 text-xs font-bold text-primary"><Clock className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{urgencyLabel(l)}</span></div><ListingCard listing={l} /></div>)}</div>
    </Section>}

    <div className="container mx-auto px-3 py-2 sm:px-4"><AdSlot size="inline" id="ad-space-02-home-after-offers" slotCode="FEATURED PARTNER" label="Featured partner space" /></div>

    {sellingFast.length > 0 && <Section eyebrow="Last few left" title={t("sellingFast")} subtitle={t("limitedQuantities")}>
      <div className="grid gap-4 md:grid-cols-3">{sellingFast.map((l) => <Link key={l.id} to="/listing/$id" params={{ id: l.id }} className="group block rounded-[1.75rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"><Card className="overflow-hidden rounded-[1.75rem] border-white/70 bg-white p-0 shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-xl"><div className="relative h-52 overflow-hidden">{l.image_url ? <img src={l.image_url} alt={l.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="h-full w-full bg-muted" />}<div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" /><Badge className="absolute left-3 top-3 rounded-full bg-accent text-accent-foreground shadow-md"><Flame className="mr-1 h-3.5 w-3.5" /> {t("onlyLeft").replace("{count}", String(l.quantity_available))}</Badge></div><div className="p-5"><div className="text-lg font-black group-hover:text-primary">{l.title}</div><div className="mt-1 text-sm text-muted-foreground">{l.merchant.business_name} · {urgencyLabel(l)}</div><div className="mt-5 flex items-end justify-between"><div><div className="text-xs text-muted-foreground line-through">{formatBND(l.original_price)}</div><div className="text-3xl font-black text-primary">{formatBND(l.discounted_price)}</div></div><span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">{t("reserve")} →</span></div></div></Card></Link>)}</div>
    </Section>}

    <Section eyebrow="Three taps" title={t("howItWorks")} subtitle={t("howItWorksSubtitle")}><div className="grid gap-4 md:grid-cols-3 md:gap-6">{[{ icon: Search, title: t("discover"), body: t("discoverBody") }, { icon: ShoppingBag, title: t("reserveStep"), body: t("reserveStepBody") }, { icon: HandCoins, title: t("collectEnjoy"), body: t("collectEnjoyBody") }].map((s, i) => <Card key={s.title} className="rounded-[1.75rem] border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl"><div className="flex items-center justify-between"><div className="grid h-13 w-13 place-items-center rounded-2xl bg-primary text-primary-foreground"><s.icon className="h-6 w-6" /></div><span className="text-5xl font-black text-primary/10">0{i + 1}</span></div><h3 className="mt-5 text-xl font-black">{s.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{s.body}</p></Card>)}</div></Section>

    {merchants.length > 0 && <Section eyebrow="Local favourites" title={t("featuredMerchants")} subtitle={t("featuredMerchantsSubtitle")}><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{merchants.map((m) => <Link key={m.id} to="/merchant-profile/$id" params={{ id: m.id }} className="group block rounded-[1.75rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"><Card className="overflow-hidden rounded-[1.75rem] border-white/70 bg-white p-0 shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-xl">{m.image_url ? <img src={m.image_url} alt={m.business_name} loading="lazy" className="h-44 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-40" /> : <div className="h-44 w-full bg-gradient-to-br from-primary/20 to-accent/20 sm:h-40" />}<div className="p-5"><div className="flex items-center justify-between gap-3"><div className="min-w-0 truncate text-lg font-black group-hover:text-primary">{m.business_name}</div>{m.rating != null && <Badge variant="secondary" className="shrink-0 rounded-full">★ {Number(m.rating).toFixed(1)}</Badge>}</div><div className="mt-1 text-sm text-muted-foreground">{m.business_type} · {m.district}</div><div className="mt-4 text-sm font-black text-primary">{t("viewTodaysOffers")} →</div></div></Card></Link>)}</div></Section>}

    <Section eyebrow="Why it works" title={t("whyPeopleLove")}><div className="grid gap-4 md:grid-cols-2 md:gap-6"><BenefitCard title={t("forCustomers")} items={[t("customerBenefit1"), t("customerBenefit2"), t("customerBenefit3"), t("customerBenefit4")]} /><BenefitCard title={t("forBusinessesCard")} items={[t("businessBenefit1"), t("businessBenefit2"), t("businessBenefit3"), t("businessBenefit4")]} /></div></Section>

    <div className="container mx-auto px-3 py-2 sm:px-4"><AdSlot size="leaderboard" id="ad-space-03-home-lower" slotCode="LOCAL BRAND SPOTLIGHT" label="Local brand spotlight" /></div>

    <Section eyebrow="Impact" title={t("foodWasteImpact")}><Card className="relative overflow-hidden rounded-[2rem] border-0 bg-gradient-to-br from-primary via-primary to-emerald-800 p-6 text-primary-foreground shadow-2xl shadow-primary/20 sm:p-8 md:p-12"><div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" /><div className="relative grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end"><div className="max-w-3xl"><h3 className="text-3xl font-black leading-tight md:text-5xl">{t("foodWasteTitle")}</h3><p className="mt-4 text-sm leading-7 text-primary-foreground/85 sm:text-base">{t("foodWasteBody")}</p></div><div className="grid grid-cols-3 gap-3 text-center md:grid-cols-1"><ImpactNumber value="3k+" label="meals" /><ImpactNumber value="BND" label="saved" /><ImpactNumber value="less" label="waste" /></div></div></Card></Section>

    <Section title={t("faq")}><div className="mx-auto max-w-3xl rounded-[2rem] border border-white/70 bg-white/75 p-3 shadow-sm backdrop-blur"><Accordion type="single" collapsible className="w-full">{[{ q: t("faqSafeQ"), a: t("faqSafeA") }, { q: t("faqKindQ"), a: t("faqKindA") }, { q: t("faqPayQ"), a: t("faqPayA") }, { q: t("faqCancelQ"), a: t("faqCancelA") }].map((f, i) => <AccordionItem key={i} value={`q-${i}`} className="border-border/70 px-3"><AccordionTrigger className="text-left font-bold">{f.q}</AccordionTrigger><AccordionContent className="text-muted-foreground">{f.a}</AccordionContent></AccordionItem>)}</Accordion></div></Section>
  </SiteLayout>;
}

function HeroProof({ icon: Icon, title, body }: { icon: any; title: string; body: string }) { return <div className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-center gap-2 font-black text-foreground"><Icon className="h-4 w-4 text-primary" />{title}</div><div className="mt-1 text-xs leading-5 text-muted-foreground">{body}</div></div>; }
function QuickChip({ icon: Icon, label, count }: { icon: any; label: string; count?: number }) { return <Button asChild variant="outline" className="h-11 shrink-0 rounded-full border-primary/15 bg-white/70 px-4 font-bold shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"><Link to="/browse"><Icon className="h-4 w-4" />{label}{typeof count === "number" && count > 0 ? <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">{count}</span> : null}</Link></Button>; }
function Section({ eyebrow, title, subtitle, notice, action, children }: { eyebrow?: string; title: string; subtitle?: string; notice?: ReactNode; action?: ReactNode; children: ReactNode }) { return <section className="container mx-auto px-3 py-10 sm:px-4 md:py-16"><div className="mb-7 flex flex-col gap-4 sm:mb-9 md:flex-row md:items-end md:justify-between"><div className="max-w-2xl">{eyebrow && <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-accent">{eyebrow}</div>}<h2 className="text-3xl font-black leading-[0.98] tracking-[-0.04em] sm:text-4xl md:text-5xl">{title}</h2>{subtitle && <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">{subtitle}</p>}{notice && <div className="mt-3">{notice}</div>}</div>{action}</div>{children}</section>; }
function BenefitCard({ title, items }: { title: string; items: string[] }) { return <Card className="rounded-[1.75rem] border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur"><h3 className="text-2xl font-black">{title}</h3><ul className="mt-5 space-y-3 text-sm">{items.map((it) => <li key={it} className="flex items-start gap-3"><span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10"><TrendingUp className="h-3.5 w-3.5 text-primary" /></span><span className="leading-6">{it}</span></li>)}</ul></Card>; }
function ImpactNumber({ value, label }: { value: string; label: string }) { return <div className="rounded-3xl bg-white/10 p-4 backdrop-blur"><div className="text-2xl font-black md:text-3xl">{value}</div><div className="text-xs font-bold uppercase tracking-wider text-white/70">{label}</div></div>; }
