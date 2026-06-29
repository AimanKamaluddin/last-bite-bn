import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SiteLayout } from "@/components/site/SiteLayout";
import {
  AlertTriangle,
  BadgeCheck,
  BookOpen,
  Camera,
  CheckCircle2,
  Clock,
  ClipboardList,
  HandCoins,
  HelpCircle,
  MapPin,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  Store,
  Utensils,
} from "lucide-react";

export const Route = createFileRoute("/user-guide")({
  head: () => ({
    meta: [
      { title: "User Guide — Last Bite" },
      {
        name: "description",
        content:
          "Step-by-step guide for buyers and vendors using Last Bite BN, including examples, pickup rules, listing tips, and order workflows.",
      },
      { property: "og:title", content: "User Guide — Last Bite" },
      {
        property: "og:description",
        content:
          "Learn how to reserve surplus food, collect orders, create vendor listings, manage pickup windows, and handle orders on Last Bite BN.",
      },
    ],
  }),
  component: UserGuidePage,
});

function UserGuidePage() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_15%_20%,hsl(var(--accent)/0.18),transparent_30%),linear-gradient(180deg,hsl(var(--cream)),hsl(var(--background)))]">
        <div className="container mx-auto px-4 py-10 sm:py-14 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="rounded-full bg-primary/10 px-4 py-1.5 text-primary hover:bg-primary/10">
              <BookOpen className="mr-1.5 h-3.5 w-3.5" /> Last Bite User Guide
            </Badge>
            <h1 className="mt-5 text-4xl font-black leading-[1.02] tracking-[-0.04em] sm:text-5xl md:text-6xl">
              How to use Last Bite as a buyer or vendor
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              This guide explains the full journey: finding discounted food, reserving it, collecting it on time, creating vendor offers, managing orders, and avoiding common mistakes.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full">
                <a href="#buyers"><ShoppingBag className="mr-2 h-4 w-4" /> Buyer guide</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full bg-white/70">
                <a href="#vendors"><Store className="mr-2 h-4 w-4" /> Vendor guide</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard icon={ShoppingBag} title="For buyers" body="Reserve discounted surplus food, choose a pickup time, then pay the merchant when collecting." />
          <SummaryCard icon={Store} title="For vendors" body="Create clear offers for unsold food, set a pickup window, and manage reservations from the dashboard." />
          <SummaryCard icon={Clock} title="Most important rule" body="Pickup must happen during the listed pickup window. Late collection may not be accepted." />
        </div>
      </section>

      <section id="buyers" className="container mx-auto scroll-mt-24 px-4 py-10 md:py-16">
        <GuideHeader eyebrow="Buyer guide" title="How buyers reserve and collect food" description="Use this section if you are looking for food deals from local bakeries, restaurants, cafes, hotels, supermarkets, and other vendors." />

        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <Card className="rounded-[2rem] border-primary/15 bg-white/80 p-5 shadow-sm sm:p-6">
            <h3 className="text-2xl font-black">Buyer steps</h3>
            <StepList
              steps={[
                { icon: Search, title: "Browse available food", body: "Open Browse Food and look through active offers. You can search by food name or merchant, then filter by district or category." },
                { icon: Utensils, title: "Open a listing", body: "Tap a food card to see photos, price, quantity left, pickup window, allergen information, merchant name, and pickup location details." },
                { icon: Clock, title: "Check the pickup window", body: "Make sure you can collect during the stated time. Example: if pickup is 5:00 PM to 7:00 PM, do not reserve if you can only arrive at 8:00 PM." },
                { icon: ShoppingBag, title: "Reserve your portion", body: "Tap Reserve, choose quantity, select your pickup time, and confirm. Your reservation is only complete after the confirmation page appears." },
                { icon: PackageCheck, title: "Show your pickup code", body: "At the shop, show your buyer name and pickup code. The merchant uses this to verify your reservation." },
                { icon: HandCoins, title: "Pay at pickup", body: "Payment is made directly to the merchant when you collect. No online payment is taken inside the app." },
              ]}
            />
          </Card>

          <div className="grid gap-5">
            <ExampleCard
              title="Example buyer journey"
              label="Dessert pickup"
              items={[
                "A buyer opens Browse Food at 3:30 PM and sees 'Chocolate cake slices' for BND 3.00 instead of BND 6.00.",
                "The listing says pickup is from 5:00 PM to 6:30 PM and there are 4 portions left.",
                "The buyer chooses 1 portion and selects 5:30 PM as the pickup time.",
                "At 5:30 PM, the buyer goes to the merchant, shows the pickup code, pays BND 3.00, and collects the cake.",
              ]}
            />
            <DoDont
              doItems={[
                "Reserve only when you are confident you can collect on time.",
                "Check allergens before reserving if you have dietary restrictions.",
                "Bring your pickup code and be polite to staff during busy hours.",
              ]}
              dontItems={[
                "Do not expect the merchant to hold food after the pickup window ends.",
                "Do not reserve many portions unless you intend to collect all of them.",
                "Do not assume photos are exact portion sizes unless the listing clearly says so.",
              ]}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <InfoPanel title="What buyers see on a listing" icon={ClipboardList} items={["Food title and category", "Original price and discounted price", "Quantity left", "Pickup start and end time", "Merchant name and district", "Allergen information if provided", "Photos uploaded by the vendor"]} />
          <InfoPanel title="Common buyer problems" icon={HelpCircle} items={["If food says sold out, all portions have already been reserved.", "If an offer expired, the pickup window has ended.", "If you cannot attend, cancel from My Orders when cancellation is available.", "If pickup details are unclear, contact the merchant using the details shown after reservation."]} />
        </div>
      </section>

      <section id="vendors" className="container mx-auto scroll-mt-24 px-4 py-10 md:py-16">
        <GuideHeader eyebrow="Vendor guide" title="How vendors create offers and manage orders" description="Use this section if you are a restaurant, bakery, cafe, grocer, hotel, home-based food seller, or other food business selling surplus food through Last Bite." />

        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <Card className="rounded-[2rem] border-primary/15 bg-white/80 p-5 shadow-sm sm:p-6">
            <h3 className="text-2xl font-black">Vendor steps</h3>
            <StepList
              steps={[
                { icon: Store, title: "Apply as a vendor", body: "Open For Businesses, submit your business details, and wait for approval. Once approved, your merchant dashboard becomes available." },
                { icon: BadgeCheck, title: "Complete your profile", body: "Add business name, district, address, contact details, business type, description, opening hours, and a clear shop image where possible." },
                { icon: Camera, title: "Create a new listing", body: "Add a clear food title, description, category, original price, discounted price, quantity available, photos, allergen information, and halal notes if relevant." },
                { icon: Clock, title: "Set a realistic pickup window", body: "Choose a pickup start and end time when your staff can prepare and hand over orders. Keep the window clear and manageable." },
                { icon: ClipboardList, title: "Manage reservations", body: "Use the merchant dashboard to see pending orders, pickup codes, quantities, selected pickup times, and order statuses." },
                { icon: CheckCircle2, title: "Mark orders correctly", body: "Mark orders ready when prepared, collected when handed over, or cancelled if the reservation cannot be fulfilled." },
              ]}
            />
          </Card>

          <div className="grid gap-5">
            <ExampleCard
              title="Example vendor listing"
              label="Bakery surplus"
              items={[
                "Title: Mixed pastry box",
                "Description: 3 assorted pastries from today's display. Best eaten today.",
                "Original price: BND 9.00. Discounted price: BND 4.50.",
                "Quantity: 10 boxes available.",
                "Pickup window: 6:00 PM to 7:30 PM, after the bakery's peak hours.",
                "Allergen info: Contains wheat, dairy, egg, and may contain nuts.",
              ]}
            />
            <InfoPanel title="Good listing checklist" icon={ShieldCheck} items={["Use real food photos whenever possible.", "Write a specific title, not just 'food bag'.", "State what customers can expect, even if assortment may vary.", "Keep discounts clear and attractive.", "Set quantity accurately so you do not oversell.", "Include allergen and halal information where relevant."]} />
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <DoDont
            doItems={[
              "Prepare reserved orders before the selected pickup time.",
              "Ask buyers for their pickup code before handing over food.",
              "Update listings quickly when stock changes.",
            ]}
            dontItems={[
              "Do not list food that is unsafe or no longer suitable to eat.",
              "Do not create a pickup window when no staff are available.",
              "Do not use misleading photos or unclear quantities.",
            ]}
          />
          <InfoPanel title="Order status guide" icon={PackageCheck} items={["Reserved: buyer has confirmed a reservation.", "Ready: vendor has prepared the order for pickup.", "Collected: buyer has received and paid for the order.", "Cancelled: reservation was cancelled and should not be collected.", "Expired listing: pickup window has ended and the listing is no longer bookable."]} />
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 md:py-16">
        <GuideHeader eyebrow="Rules and reminders" title="Important rules for everyone" description="These points help keep the marketplace fair, safe, and easy to manage for buyers and vendors." />
        <div className="grid gap-4 md:grid-cols-3">
          <RuleCard icon={Clock} title="Respect pickup windows" body="Buyers should arrive during the selected time. Vendors should only list windows they can support." />
          <RuleCard icon={AlertTriangle} title="Be clear about allergens" body="Vendors should disclose known allergens. Buyers with serious allergies should check carefully before reserving." />
          <RuleCard icon={MapPin} title="Check location first" body="Buyers should confirm the merchant location before reserving. Vendors should keep address details accurate." />
        </div>
      </section>

      <section className="container mx-auto px-4 pb-14 md:pb-20">
        <Card className="rounded-[2rem] bg-primary p-6 text-primary-foreground shadow-xl sm:p-8 md:p-10">
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <h2 className="text-3xl font-black tracking-[-0.03em]">Ready to use Last Bite?</h2>
              <p className="mt-3 text-sm leading-6 text-primary-foreground/85 sm:text-base">
                Buyers can start browsing food immediately. Vendors can apply, create listings after approval, and manage orders from the merchant dashboard.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
              <Button asChild variant="secondary" className="rounded-full">
                <Link to="/browse">Browse food</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white hover:text-primary">
                <Link to="/merchant/onboarding">Join as vendor</Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </SiteLayout>
  );
}

function GuideHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mb-7 max-w-3xl">
      <div className="text-xs font-black uppercase tracking-[0.2em] text-accent">{eyebrow}</div>
      <h2 className="mt-2 text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl md:text-5xl">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
    </div>
  );
}

function SummaryCard({ icon: Icon, title, body }: { icon: any; title: string; body: string }) {
  return (
    <Card className="rounded-3xl border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
      <h3 className="mt-4 text-lg font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
    </Card>
  );
}

function StepList({ steps }: { steps: { icon: any; title: string; body: string }[] }) {
  return (
    <div className="mt-5 grid gap-4">
      {steps.map((step, index) => (
        <div key={step.title} className="flex gap-3 rounded-2xl border bg-background/70 p-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground"><step.icon className="h-5 w-5" /></div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-muted-foreground">Step {index + 1}</div>
            <h4 className="mt-0.5 font-black leading-tight">{step.title}</h4>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{step.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ExampleCard({ title, label, items }: { title: string; label: string; items: string[] }) {
  return (
    <Card className="rounded-[2rem] bg-gradient-to-br from-primary via-primary to-emerald-800 p-5 text-primary-foreground shadow-xl sm:p-6">
      <Badge className="rounded-full bg-white/15 text-white hover:bg-white/15">{label}</Badge>
      <h3 className="mt-4 text-2xl font-black">{title}</h3>
      <ol className="mt-4 space-y-3 text-sm leading-6 text-primary-foreground/90">
        {items.map((item, index) => (
          <li key={item} className="flex gap-3"><span className="font-black text-white/70">{index + 1}.</span><span>{item}</span></li>
        ))}
      </ol>
    </Card>
  );
}

function DoDont({ doItems, dontItems }: { doItems: string[]; dontItems: string[] }) {
  return (
    <Card className="rounded-[2rem] p-5 sm:p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-black text-primary"><CheckCircle2 className="h-5 w-5" /> Do</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">{doItems.map((item) => <li key={item}>• {item}</li>)}</ul>
        </div>
        <div>
          <h3 className="flex items-center gap-2 text-lg font-black text-destructive"><AlertTriangle className="h-5 w-5" /> Do not</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">{dontItems.map((item) => <li key={item}>• {item}</li>)}</ul>
        </div>
      </div>
    </Card>
  );
}

function InfoPanel({ title, icon: Icon, items }: { title: string; icon: any; items: string[] }) {
  return (
    <Card className="rounded-[2rem] p-5 sm:p-6">
      <h3 className="flex items-center gap-2 text-xl font-black"><Icon className="h-5 w-5 text-primary" /> {title}</h3>
      <ul className="mt-4 grid gap-2 text-sm leading-6 text-muted-foreground">
        {items.map((item) => <li key={item} className="rounded-2xl bg-muted/45 px-3 py-2">{item}</li>)}
      </ul>
    </Card>
  );
}

function RuleCard({ icon: Icon, title, body }: { icon: any; title: string; body: string }) {
  return (
    <Card className="rounded-[2rem] p-5 sm:p-6">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent/20 text-primary"><Icon className="h-5 w-5" /></div>
      <h3 className="mt-4 text-xl font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
    </Card>
  );
}
