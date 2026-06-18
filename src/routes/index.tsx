import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ListingCard } from "@/components/listings/ListingCard";
import { AdSlot } from "@/components/ads/AdSlot";
import { sampleListings, sampleMerchants } from "@/lib/sample-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  ShoppingBag,
  HandCoins,
  Leaf,
  Sparkles,
  Store,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Last Bite — Save good food. Pay less. Reduce waste." },
      {
        name: "description",
        content:
          "Brunei's surplus food marketplace. Reserve discounted meals from bakeries, cafes, restaurants and supermarkets before closing.",
      },
      { property: "og:title", content: "Last Bite — Surplus food, fair price" },
      {
        property: "og:description",
        content: "Save good food from local Brunei businesses at up to 70% off.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto grid items-center gap-10 px-4 pb-12 pt-10 md:grid-cols-2 md:pb-20 md:pt-16">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border bg-cream px-3 py-1 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5 text-accent" /> Now serving Brunei
              Darussalam
            </span>
            <h1 className="text-4xl font-bold leading-[1.05] md:text-6xl">
              Save good food. <span className="text-primary">Pay less.</span>
              <br /> Reduce waste.
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground">
              Discover surprise bags and surplus meals from local bakeries,
              cafes, restaurants, hotels and supermarkets — at up to 70% off
              before they close.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/browse">
                  <Search className="mr-2 h-4 w-4" /> Browse Food
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/merchant/onboarding">
                  <Store className="mr-2 h-4 w-4" /> Join as Merchant
                </Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 pt-2 text-sm text-muted-foreground">
              <Stat n="20+" l="Local merchants" />
              <Stat n="500+" l="Meals saved" />
              <Stat n="4 districts" l="Across Brunei" />
            </div>
          </div>
          <div className="relative">
            <img
              src={heroImg}
              alt="Fresh pastries from a local bakery"
              width={1536}
              height={1024}
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-xl"
            />
            <Card className="absolute -bottom-4 -left-4 hidden w-60 rounded-2xl p-4 shadow-lg sm:block">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Leaf className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">1.2 tonnes</div>
                  <div className="text-xs text-muted-foreground">food rescued in Brunei</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* AD — below hero */}
      <div className="container mx-auto px-4">
        <AdSlot size="billboard" id="home-hero-billboard" label="Hero billboard" />
      </div>

      {/* HOW IT WORKS */}
      <Section
        title="How it works"
        subtitle="Three simple steps from craving to collection."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Search, title: "Discover", body: "Find surprise bags and surplus food near you, filtered by district and category." },
            { icon: ShoppingBag, title: "Reserve", body: "Pay online or at pickup. You'll get a pickup code to show the merchant." },
            { icon: HandCoins, title: "Collect & enjoy", body: "Drop by during the pickup window. Show your code and take the food home." },
          ].map((s) => (
            <Card key={s.title} className="rounded-3xl border-border/60 p-6">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* FEATURED MERCHANTS */}
      <Section title="Featured merchants" subtitle="Loved by Bruneians.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sampleMerchants.slice(0, 6).map((m) => (
            <Card key={m.id} className="overflow-hidden rounded-3xl p-0">
              <img src={m.image_url} alt={m.business_name} loading="lazy" className="h-36 w-full object-cover" />
              <div className="p-4">
                <div className="font-semibold">{m.business_name}</div>
                <div className="text-sm text-muted-foreground">
                  {m.business_type} · {m.district}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* AD — mid page */}
      <div className="container mx-auto px-4">
        <AdSlot size="leaderboard" id="home-mid-leaderboard" label="Sponsored" />
      </div>

      {/* FEATURED LISTINGS */}
      <Section title="Available today" subtitle="Reserve a meal before it's gone.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sampleListings.slice(0, 6).map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link to="/browse">See all food</Link>
          </Button>
        </div>
      </Section>

      {/* BENEFITS */}
      <Section title="Why people love Last Bite">
        <div className="grid gap-6 md:grid-cols-2">
          <BenefitCard
            title="For customers"
            items={[
              "Quality food at up to 70% off",
              "Discover new local favourites",
              "Simple pickup with QR code",
            ]}
          />
          <BenefitCard
            title="For businesses"
            items={[
              "Earn from unsold inventory",
              "Reach new customers",
              "Reduce food waste & costs",
              "Simple dashboard, no extra hardware",
            ]}
          />
        </div>
      </Section>

      {/* IMPACT */}
      <Section title="Food waste impact">
        <Card className="overflow-hidden rounded-3xl border-border/60 bg-primary text-primary-foreground p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-3">
            <Impact n="1.2 t" l="Food rescued" />
            <Impact n="3,000 kg" l="CO₂ avoided" />
            <Impact n="B$28k" l="Saved by customers" />
          </div>
        </Card>
      </Section>

      {/* FAQ */}
      <Section title="Frequently asked questions">
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: "Is the food safe to eat?",
                a: "Yes. Merchants only list food that is fresh and within safe consumption windows. They are responsible for quality and allergen information.",
              },
              {
                q: "What is a surprise bag?",
                a: "A bag of unsold items chosen by the merchant. The exact contents are a surprise — that's part of the fun!",
              },
              {
                q: "How do I pay?",
                a: "You can pay online at checkout, or choose to pay the merchant during pickup.",
              },
              {
                q: "Can I cancel a reservation?",
                a: "Yes, before the merchant-defined cut-off time. After that, the order is locked in to be fair to the merchant.",
              },
            ].map((f, i) => (
              <AccordionItem key={i} value={`q-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>
    </SiteLayout>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="container mx-auto px-4 py-14 md:py-20">
      <div className="mb-8 max-w-2xl">
        <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
        {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="text-xl font-bold text-foreground">{n}</div>
      <div>{l}</div>
    </div>
  );
}

function BenefitCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="rounded-3xl p-6">
      <h3 className="text-xl font-semibold">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2">
            <TrendingUp className="mt-0.5 h-4 w-4 text-primary" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Impact({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="text-4xl font-bold">{n}</div>
      <div className="mt-1 text-primary-foreground/80">{l}</div>
    </div>
  );
}
