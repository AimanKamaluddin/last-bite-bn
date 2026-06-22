import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import {
  Search,
  ShoppingBag,
  HandCoins,
  Leaf,
  Store,
  TrendingUp,
  Users,
  Recycle,
  BadgePercent,
  Globe,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Last Bite" },
      {
        name: "description",
        content:
          "Learn about Last Bite Brunei — our mission to reduce food waste, support local merchants, and help customers save money on great food.",
      },
      { property: "og:title", content: "About Us — Last Bite" },
      {
        property: "og:description",
        content:
          "Our mission, benefits for vendors & customers, and how Last Bite works.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="container mx-auto px-4 pb-12 pt-10 md:pb-20 md:pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border bg-cream px-3 py-1 text-xs font-medium">
            <Leaf className="h-3.5 w-3.5 text-accent" /> Our Story
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-[1.05] md:text-5xl">
            Fighting food waste, <span className="text-primary">one bite at a time.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Last Bite is Brunei&apos;s first surplus food marketplace. We connect
            local bakeries, cafes, restaurants, hotels and supermarkets with
            customers who want great food at a fraction of the price — while
            keeping perfectly good meals out of the bin.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Our purpose</h2>
          <p className="mt-4 text-muted-foreground">
            Every day, tons of edible food are discarded simply because they
            weren&apos;t sold in time. Last Bite exists to change that. We give
            merchants a simple way to recover value from unsold inventory, and
            we give customers an easy way to discover delicious, discounted
            meals nearby.
          </p>
          <p className="mt-4 text-muted-foreground">
            Less waste. More savings. Stronger communities.
          </p>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Why Last Bite works</h2>
          <p className="mt-2 text-muted-foreground">
            Built for everyone at the table.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <BenefitCard
            title="For customers"
            icon={Users}
            items={[
              "Save up to 70% on quality meals from trusted local businesses",
              "Discover hidden gems and new favourites in every district",
              "Simple pickup with a digital code — no hassle, no queues",
              "Feel good knowing you're helping reduce food waste",
            ]}
          />
          <BenefitCard
            title="For vendors"
            icon={Store}
            items={[
              "Turn unsold inventory into extra revenue instead of waste",
              "Reach new customers who may become regulars",
              "Reduce disposal costs and environmental footprint",
              "Simple dashboard to list, manage and track sales — no extra hardware needed",
            ]}
          />
        </div>
      </section>

      {/* HOW IT WORKS — copied from homepage */}
      <Section
        title="How it works"
        subtitle="Three simple steps from craving to collection."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Search,
              title: "Discover",
              body: "Find surprise bags and surplus food near you, filtered by district and category.",
            },
            {
              icon: ShoppingBag,
              title: "Reserve",
              body: "Pay online or at pickup. You'll get a pickup code to show the merchant.",
            },
            {
              icon: HandCoins,
              title: "Collect & enjoy",
              body: "Drop by during the pickup window. Show your code and take the food home.",
            },
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

      {/* IMPACT STRIP */}
      <section className="container mx-auto px-4 py-14 md:py-20">
        <Card className="overflow-hidden rounded-3xl border-border/60 bg-primary text-primary-foreground p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-3">
            <Impact n="1.2 t" l="Food rescued" icon={Recycle} />
            <Impact n="3,000 kg" l="CO₂ avoided" icon={Globe} />
            <Impact n="B$28k" l="Saved by customers" icon={BadgePercent} />
          </div>
        </Card>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20 pt-10 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Ready to join?</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Whether you&apos;re hungry for a deal or looking to move unsold stock,
          Last Bite makes it easy.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
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
      </section>
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

function BenefitCard({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: React.ElementType;
  items: string[];
}) {
  return (
    <Card className="rounded-3xl p-6 md:p-8">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <ul className="mt-6 space-y-3 text-sm">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2">
            <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Impact({
  n,
  l,
  icon: Icon,
}: {
  n: string;
  l: string;
  icon: React.ElementType;
}) {
  return (
    <div className="text-center md:text-left">
      <div className="flex items-center justify-center gap-2 md:justify-start">
        <Icon className="h-5 w-5 text-primary-foreground/80" />
        <div className="text-4xl font-bold">{n}</div>
      </div>
      <div className="mt-1 text-primary-foreground/80">{l}</div>
    </div>
  );
}
