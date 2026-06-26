import { cn } from "@/lib/utils";
import { Sparkles, TrendingUp, Users, MapPin, ArrowRight, Mail, Store } from "lucide-react";

type AdSize = "leaderboard" | "billboard" | "rectangle" | "square" | "skyscraper" | "mobile-banner" | "inline";

const SIZE_CLASSES: Record<AdSize, string> = {
  leaderboard: "h-32 md:h-36",
  billboard: "h-48 md:h-64",
  rectangle: "h-72",
  square: "aspect-square",
  skyscraper: "h-[600px] w-[160px]",
  "mobile-banner": "h-24",
  inline: "h-48",
};

interface AdSlotProps {
  size?: AdSize;
  label?: string;
  className?: string;
  id?: string;
  ctaHref?: string;
}

const AD_EMAIL = "lastbite.bn@gmail.com";
const DEFAULT_CTA = `mailto:${AD_EMAIL}?subject=Advertise%20on%20Last%20Bite`;

export function AdSlot({ size = "leaderboard", label, className, id, ctaHref = DEFAULT_CTA }: AdSlotProps) {
  const isSlim = size === "leaderboard" || size === "mobile-banner";
  const isTall = size === "skyscraper";
  const isCompact = size === "rectangle" || size === "square" || size === "inline" || isSlim;

  return (
    <aside
      role="complementary"
      aria-label={label ?? "Advertising space available"}
      data-ad-slot={id ?? size}
      className={cn(
        "group relative mx-auto w-full max-w-5xl overflow-hidden rounded-3xl",
        "bg-gradient-to-br from-primary via-emerald-600 to-accent text-primary-foreground",
        "shadow-[0_24px_70px_-28px_hsl(var(--primary)/0.7)] ring-1 ring-white/20",
        SIZE_CLASSES[size],
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-70 mix-blend-soft-light" style={{ backgroundImage: "radial-gradient(circle at 18% 18%, rgba(255,255,255,0.55), transparent 42%), radial-gradient(circle at 88% 85%, rgba(255,255,255,0.35), transparent 48%)" }} />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="pointer-events-none absolute -left-12 -top-12 h-44 w-44 rounded-full bg-white/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 -bottom-10 h-52 w-52 rounded-full bg-accent/45 blur-3xl" />

      <span className="absolute right-3 top-3 z-10 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm">
        Premium ad space
      </span>

      {isTall ? <TallLayout ctaHref={ctaHref} /> : isSlim ? <SlimLayout ctaHref={ctaHref} /> : isCompact ? <CompactLayout ctaHref={ctaHref} /> : <FullLayout ctaHref={ctaHref} />}
    </aside>
  );
}

function FullLayout({ ctaHref }: { ctaHref: string }) {
  return (
    <div className="relative z-10 flex h-full items-center justify-between gap-6 px-6 md:px-10">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm">
          <Sparkles className="h-3 w-3" /> Advertising space now available
        </div>
        <h3 className="mt-2 text-2xl font-bold leading-tight md:text-4xl">
          Put your restaurant in front of hungry customers.
        </h3>
        <p className="mt-2 max-w-xl text-sm opacity-95 md:text-base">
          Promote your café, restaurant, bakery or supermarket across Last Bite and drive more foot traffic during your slow hours.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Cta href={ctaHref} />
          <ContactLine />
        </div>
      </div>
      <div className="hidden shrink-0 grid-cols-1 gap-2 sm:grid">
        <Stat icon={Users} k="Food buyers" v="ready to reserve" />
        <Stat icon={MapPin} k="Brunei-wide" v="local reach" />
        <Stat icon={TrendingUp} k="More visibility" v="for your offers" />
      </div>
    </div>
  );
}

function CompactLayout({ ctaHref }: { ctaHref: string }) {
  return (
    <div className="relative z-10 flex h-full flex-col justify-between gap-2 p-5">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm">
          <Store className="h-3 w-3" /> Vendor spotlight
        </div>
        <h3 className="mt-2 text-xl font-bold leading-tight">Advertise your business here.</h3>
        <p className="mt-1 text-xs opacity-90">Reach customers already browsing for food deals across Brunei.</p>
      </div>
      <div className="space-y-2">
        <Cta href={ctaHref} />
        <ContactLine compact />
      </div>
    </div>
  );
}

function SlimLayout({ ctaHref }: { ctaHref: string }) {
  return (
    <div className="relative z-10 flex h-full items-center justify-between gap-4 px-5 md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15 backdrop-blur-sm">
          <Store className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold leading-tight md:text-lg">Advertise your food business on Last Bite</div>
          <div className="truncate text-[11px] opacity-90 md:text-xs">To advertise, contact us at {AD_EMAIL}</div>
        </div>
      </div>
      <Cta href={ctaHref} compact />
    </div>
  );
}

function TallLayout({ ctaHref }: { ctaHref: string }) {
  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-between gap-4 p-5 text-center">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm">
          <Sparkles className="h-3 w-3" /> Advertise
        </div>
        <h3 className="mt-3 text-lg font-bold leading-tight">Your business could be here.</h3>
        <p className="mt-1 text-xs opacity-90">Reach hungry customers browsing nearby offers.</p>
      </div>
      <div className="grid w-full gap-2">
        <Stat icon={Users} k="Customers" v="browsing" tight />
        <Stat icon={TrendingUp} k="Boost" v="visibility" tight />
      </div>
      <div className="space-y-2">
        <Cta href={ctaHref} />
        <ContactLine compact />
      </div>
    </div>
  );
}

function Stat({ icon: Icon, k, v, tight }: { icon: typeof Users; k: string; v: string; tight?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm", tight && "px-2 py-1.5")}>
      <Icon className="h-4 w-4 opacity-80" />
      <div className="text-left leading-tight">
        <div className="text-sm font-bold">{k}</div>
        <div className="text-[10px] uppercase tracking-wide opacity-80">{v}</div>
      </div>
    </div>
  );
}

function ContactLine({ compact }: { compact?: boolean }) {
  return (
    <div className={cn("inline-flex items-center gap-1.5 font-medium opacity-95", compact ? "text-[11px]" : "text-xs")}>
      <Mail className="h-3.5 w-3.5" />
      To advertise, contact us at <span className="font-bold">{AD_EMAIL}</span>
    </div>
  );
}

function Cta({ href, className, compact }: { href: string; className?: string; compact?: boolean }) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-white text-primary shadow-sm transition hover:bg-white/90 hover:shadow-md",
        compact ? "px-3 py-1.5 text-xs font-semibold" : "px-4 py-2 text-sm font-semibold",
        className,
      )}
    >
      Advertise with us
      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
    </a>
  );
}
