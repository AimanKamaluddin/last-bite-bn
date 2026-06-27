import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteLayout } from "@/components/site/SiteLayout";
import { AdSlot } from "@/components/ads/AdSlot";
import { TESTING_AD_IMAGE } from "@/assets/testing-ad-image";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ListingCard, type ListingCardData } from "@/components/listings/ListingCard";
import { PickupWindowAlert } from "@/components/orders/PickupWindowAlert";
import { formatBND } from "@/lib/sample-data";
import { useLanguage } from "@/lib/i18n";
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
  const { t } = useLanguage();
  const [merchants, setMerchants] = useState<any[]>([]);
  const [listings, setListings] = useState<ListingCardData[]>([]);
  const [testingMerchantId, setTestingMerchantId] = useState<string | null>(null);

  useEffect(() => { (async () => {
    const [{ data: m }, { data: l }, { data: testing }] = await Promise.all([
      (supabase as any).from("merchants_public").select("id, business_name, business_type, district, image_url, rating").order("created_at", { ascending: false }).limit(6),
      (supabase as any).from("listings").select("*, merchants_public!inner(business_name, district, rating)").eq("visible", true).eq("status", "active").order("created_at", { ascending: false }).limit(24),
      (supabase as any).from("merchants_public").select("id").ilike("business_name", "testing").maybeSingle(),
    ]);
    setMerchants(m ?? []);
    setTestingMerchantId(testing?.id ?? null);
    setListings((l ?? []).map((d: any) => ({ id: d.id, title: d.title, category: d.category, original_price: Number(d.original_price), discounted_price: Number(d.discounted_price), quantity_available: d.quantity_available, pickup_start: d.pickup_start, pickup_end: d.pickup_end, created_at: d.created_at, produced_at: d.produced_at, image_url: d.image_url || "", merchant: { business_name: d.merchants_public?.business_name ?? "", district: d.merchants_public?.district ?? "", rating: Number(d.merchants_public?.rating ?? 0) } })));
  })(); }, []);

  const liveListings = useMemo(() => listings.filter((l) => !isExpired(l.pickup_end) && l.quantity_available > 0), [listings]);
  const availableNow = useMemo(() => [...liveListings].sort((a, b) => minutesUntil(a.pickup_end) - minutesUntil(b.pickup_end) || a.quantity_available - b.quantity_available).slice(0, 6), [liveListings]);
  const sellingFast = useMemo(() => [...liveListings].sort((a, b) => a.quantity_available - b.quantity_available || minutesUntil(a.pickup_end) - minutesUntil(b.pickup_end)).slice(0, 3), [liveListings]);
  const underFive = liveListings.filter((l) => l.discounted_price <= 5).length;

  return <SiteLayout>
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto grid items-center gap-7 px-3 pb-8 pt-6 sm:px-4 md:grid-cols-[1.05fr_0.95fr] md:gap-10 md:pb-14 md:pt-12">
        <div className="space-y-5 sm:space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium shadow-sm"><Sparkles className="h-3.5 w-3.5 text-accent" /> {t("foodAvailableToday")}</span>
          <div className="space-y-3 sm:space-y-4">
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl md:text-6xl">{t("heroTitleStart")} <span className="text-primary">{t("heroTitleHighlight")}</span></h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">{t("heroBody")}</p>
          </div>
          <div className="grid gap-2 sm:flex sm:flex-wrap sm:gap-3">
            <Button asChild size="lg" className="h-12 rounded-full text-base"><Link to="/browse"><ShoppingBag className="mr-2 h-4 w-4" /> {t("reserveNow")}</Link></Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full text-base"><Link to="/merchant/onboarding"><Store className="mr-2 h-4 w-4" /> {t("joinAsMerchant")}</Link></Button>
          </div>
          <div className="grid gap-2 pt-1 text-sm sm:grid-cols-3 sm:gap-3">
            <HeroProof icon={Timer} title={t("pickupToday")} body={t("shortPickupWindows")} />
            <HeroProof icon={HandCoins} title={t("payLess")} body={t("discountedLocalFood")} />
            <HeroProof icon={Leaf} title={t("wasteLess")} body={t("giveGoodFoodChance")} />
          </div>
        </div>

        <a href={testingMerchantId ? `/merchant-profile/${testingMerchantId}` : "/browse"} className="group relative block min-h-[300px] overflow-hidden rounded-[1.75rem] shadow-[0_28px_90px_-35px_hsl(var(--primary)/0.85)] ring-1 ring-border/70 sm:min-h-[360px] md:min-h-[460px] md:rounded-[2rem]">
          <img src={TESTING_AD_IMAGE} alt="Testing sponsored offer" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-primary shadow-md sm:left-4 sm:top-4 sm:text-[11px]">AD SPACE 01</span>
          <span className="absolute right-3 top-3 rounded-full bg-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm ring-1 ring-white/25 sm:right-4 sm:top-4">{t("sponsored")}</span>
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-7">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm"><Sparkles className="h-3 w-3" /> {t("featuredSponsor")}</div>
            <h2 className="mt-2 text-3xl font-bold leading-tight text-white sm:mt-3 md:text-5xl">Testing</h2>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm transition group-hover:bg-white/90">{t("viewProfile")} <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" /></div>
          </div>
        </a>
      </div>
    </section>

    <section className="container mx-auto px-3 py-5 sm:px-4 sm:py-6">
      <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <QuickChip icon={Flame} label={t("availableNow")} />
        <QuickChip icon={Coffee} label={t("coffee")} />
        <QuickChip icon={PackageSearch} label={t("bakery")} />
        <QuickChip icon={Utensils} label={t("meals")} />
        <QuickChip icon={Sparkles} label={t("desserts")} />
        <QuickChip icon={CupSoda} label={t("drinks")} />
        <QuickChip icon={HandCoins} label={t("underBndFive")} count={underFive} />
        <QuickChip icon={TrendingUp} label={t("highestDiscount")} />
        <QuickChip icon={MapPin} label={t("nearMe")} />
      </div>
    </section>

    {availableNow.length > 0 && <Section title="Available Today" subtitle={t("reserveBeforePickup")} notice={<PickupWindowAlert compact />} action={<Button asChild variant="outline" className="rounded-full"><Link to="/browse">{t("browseAll")} <ArrowRight className="h-4 w-4" /></Link></Button>}>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">{availableNow.map((l) => <div key={l.id} className="relative"><div className="absolute left-3 top-3 z-10 rounded-full bg-background/95 px-3 py-1 text-xs font-semibold shadow"><Clock className="mr-1 inline h-3.5 w-3.5 text-primary" />{urgencyLabel(l)}</div><ListingCard listing={l} /></div>)}</div>
    </Section>}

    <div className="container mx-auto px-3 py-2 sm:px-4"><AdSlot size="inline" id="ad-space-02-home-after-offers" slotCode="AD SPACE 02" label="AD SPACE 02 homepage after offers" /></div>

    {sellingFast.length > 0 && <Section title={t("sellingFast")} subtitle={t("limitedQuantities")}>
      <div className="grid gap-4 md:grid-cols-3">{sellingFast.map((l) => <Link key={l.id} to="/listing/$id" params={{ id: l.id }} className="group block rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"><Card className="overflow-hidden rounded-3xl p-0 transition group-hover:-translate-y-1 group-hover:shadow-lg"><div className="relative h-48 overflow-hidden md:h-44">{l.image_url ? <img src={l.image_url} alt={l.title} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" /> : <div className="h-full w-full bg-muted" />}<Badge className="absolute left-3 top-3 rounded-full bg-accent text-accent-foreground"><Flame className="mr-1 h-3.5 w-3.5" /> {t("onlyLeft").replace("{count}", String(l.quantity_available))}</Badge></div><div className="p-4"><div className="font-semibold group-hover:text-primary">{l.title}</div><div className="text-sm text-muted-foreground">{l.merchant.business_name} · {urgencyLabel(l)}</div><div className="mt-4 flex items-end justify-between"><div><div className="text-xs text-muted-foreground line-through">{formatBND(l.original_price)}</div><div className="text-2xl font-bold text-primary">{formatBND(l.discounted_price)}</div></div><span className="text-sm font-semibold text-primary">{t("reserve")} →</span></div></div></Card></Link>)}</div>
    </Section>}

    <Section title={t("howItWorks")} subtitle={t("howItWorksSubtitle")}><div className="grid gap-4 md:grid-cols-3 md:gap-6">{[{ icon: Search, title: t("discover"), body: t("discoverBody") }, { icon: ShoppingBag, title: t("reserveStep"), body: t("reserveStepBody") }, { icon: HandCoins, title: t("collectEnjoy"), body: t("collectEnjoyBody") }].map((s) => <Card key={s.title} className="rounded-3xl border-border/60 p-5 sm:p-6"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground"><s.icon className="h-6 w-6" /></div><h3 className="mt-4 text-lg font-semibold">{s.title}</h3><p className="mt-1 text-sm text-muted-foreground">{s.body}</p></Card>)}</div></Section>

    {merchants.length > 0 && <Section title={t("featuredMerchants")} subtitle={t("featuredMerchantsSubtitle")}><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{merchants.map((m) => <Link key={m.id} to="/merchant-profile/$id" params={{ id: m.id }} className="group block rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"><Card className="overflow-hidden rounded-3xl p-0 transition group-hover:-translate-y-1 group-hover:shadow-lg">{m.image_url ? <img src={m.image_url} alt={m.business_name} loading="lazy" className="h-40 w-full object-cover transition group-hover:scale-105 sm:h-36" /> : <div className="h-40 w-full bg-muted sm:h-36" />}<div className="p-4"><div className="flex items-center justify-between gap-3"><div className="min-w-0 truncate font-semibold group-hover:text-primary">{m.business_name}</div>{m.rating != null && <Badge variant="secondary" className="shrink-0 rounded-full">★ {Number(m.rating).toFixed(1)}</Badge>}</div><div className="mt-1 text-sm text-muted-foreground">{m.business_type} · {m.district}</div><div className="mt-3 text-xs font-medium text-primary">{t("viewTodaysOffers")} →</div></div></Card></Link>)}</div></Section>}

    <Section title={t("whyPeopleLove")}><div className="grid gap-4 md:grid-cols-2 md:gap-6"><BenefitCard title={t("forCustomers")} items={[t("customerBenefit1"), t("customerBenefit2"), t("customerBenefit3"), t("customerBenefit4")]} /><BenefitCard title={t("forBusinessesCard")} items={[t("businessBenefit1"), t("businessBenefit2"), t("businessBenefit3"), t("businessBenefit4")]} /></div></Section>

    <div className="container mx-auto px-3 py-2 sm:px-4"><AdSlot size="leaderboard" id="ad-space-03-home-lower" slotCode="AD SPACE 03" label="AD SPACE 03 homepage lower" /></div>

    <Section title={t("foodWasteImpact")}><Card className="overflow-hidden rounded-3xl border-border/60 bg-primary p-6 text-primary-foreground sm:p-8 md:p-12"><div className="max-w-3xl"><h3 className="text-2xl font-bold md:text-3xl">{t("foodWasteTitle")}</h3><p className="mt-3 text-sm leading-relaxed text-primary-foreground/85 sm:text-base">{t("foodWasteBody")}</p></div></Card></Section>

    <Section title={t("faq")}><div className="mx-auto max-w-3xl"><Accordion type="single" collapsible className="w-full">{[{ q: t("faqSafeQ"), a: t("faqSafeA") }, { q: t("faqKindQ"), a: t("faqKindA") }, { q: t("faqPayQ"), a: t("faqPayA") }, { q: t("faqCancelQ"), a: t("faqCancelA") }].map((f, i) => <AccordionItem key={i} value={`q-${i}`}><AccordionTrigger className="text-left">{f.q}</AccordionTrigger><AccordionContent>{f.a}</AccordionContent></AccordionItem>)}</Accordion></div></Section>
  </SiteLayout>;
}

function HeroProof({ icon: Icon, title, body }: { icon: any; title: string; body: string }) { return <div className="rounded-2xl border bg-background/70 p-3 shadow-sm"><div className="flex items-center gap-2 font-semibold text-foreground"><Icon className="h-4 w-4 text-primary" />{title}</div><div className="mt-1 text-xs text-muted-foreground">{body}</div></div>; }
function QuickChip({ icon: Icon, label, count }: { icon: any; label: string; count?: number }) { return <Button asChild variant="outline" className="h-10 shrink-0 rounded-full px-4"><Link to="/browse"><Icon className="h-4 w-4" />{label}{typeof count === "number" && count > 0 ? <span className="ml-1 rounded-full bg-primary/10 px-1.5 text-xs text-primary">{count}</span> : null}</Link></Button>; }
function Section({ title, subtitle, notice, action, children }: { title: string; subtitle?: string; notice?: ReactNode; action?: ReactNode; children: ReactNode }) { return <section className="container mx-auto px-3 py-10 sm:px-4 md:py-16"><div className="mb-6 flex flex-col gap-4 sm:mb-8 md:flex-row md:items-end md:justify-between"><div className="max-w-2xl"><h2 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">{title}</h2>{subtitle && <p className="mt-2 text-sm text-muted-foreground sm:text-base">{subtitle}</p>}{notice && <div className="mt-3">{notice}</div>}</div>{action}</div>{children}</section>; }
function BenefitCard({ title, items }: { title: string; items: string[] }) { return <Card className="rounded-3xl p-5 sm:p-6"><h3 className="text-xl font-semibold">{title}</h3><ul className="mt-4 space-y-3 text-sm">{items.map((it) => <li key={it} className="flex items-start gap-2"><TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{it}</span></li>)}</ul></Card>; }
