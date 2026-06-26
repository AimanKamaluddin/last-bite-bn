import { cn } from "@/lib/utils";
import { Sparkles, TrendingUp, Users, MapPin, ArrowRight, Mail, Store } from "lucide-react";

type AdSize = "leaderboard" | "billboard" | "rectangle" | "square" | "skyscraper" | "mobile-banner" | "inline";

const SIZE_CLASSES: Record<AdSize, string> = {
  leaderboard: "min-h-24 md:min-h-28",
  billboard: "min-h-36 md:min-h-44",
  rectangle: "min-h-64",
  square: "aspect-square",
  skyscraper: "h-[560px] w-[160px]",
  "mobile-banner": "min-h-20",
  inline: "min-h-28 md:min-h-32",
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
  const isSlim = size === "leaderboard" || size === "mobile-banner" || size === "inline";
  const isTall = size === "skyscraper";
  const isCompact = size === "rectangle" || size === "square";

  return (
    <aside
      role="complementary"
      aria-label={label ?? "Sponsored space"}
      data-ad-slot={id ?? size}
      className={cn(
        "group relative mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-border/70",
        "bg-card text-card-foreground shadow-sm",
        SIZE_CLASSES[size],
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/10" />
      <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-accent/10 blur-3xl" />

      <span className="absolute right-3 top-3 z-10 rounded-full border bg-background/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
        Sponsored
      </span>

      {isTall ? <TallLayout ctaHref={ctaHref} /> : isSlim ? <SlimLayout ctaHref={ctaHref} /> : isCompact ? <CompactLayout ctaHref={ctaHref} /> : <FullLayout ctaHref={ctaHref} />}
    </aside>
  );
}

function FullLayout({ ctaHref }: { ctaHref: string }) {
  return (
    <div className="relative z-10 flex h-full items-center justify-between gap-6 px-6 py-6 md:px-8">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
          <Sparkles className="h-3 w-3" /> Advertising space available
        </div>
        <h3 className="mt-2 text-2xl font-bold leading-tight md:text-3xl">
          Promote your business on Last Bite.
        </h3>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
          Reach customers browsing local food offers across Brunei.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Cta href={ctaHref} />
          <ContactLine />
        </div>
      </div>
      <div className="hidden shrink-0 grid-cols-1 gap-2 sm:grid">
        <Stat icon={Users} k="Food buyers" v="browsing" />
        <Stat icon={MapPin} k="Brunei" v="local reach" />
        <Stat icon={TrendingUp} k="Visibility" v="for your brand" />
      </div>
    </div>
  );
}

function CompactLayout({ ctaHref }: { ctaHref: string }) {
  return (
    <div className="relative z-10 flex h-full flex-col justify-between gap-2 p-5">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
          <Store className="h-3 w-3" /> Business spotlight
        </div>
        <h3 className="mt-2 text-xl font-bold leading-tight">Advertise your business here.</h3>
        <p className="mt-1 text-xs text-muted-foreground">Reach customers browsing food offers across Brunei.</p>
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
    <div className="relative z-10 flex h-full items-center justify-between gap-4 px-5 py-4 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Store className="h-5 w-5" />
        </div>
        <div className="min-w-0 pr-16 md:pr-0">
          <div className="text-sm font-bold leading-tight md:text-base">Advertise on Last Bite</div>
          <div className="truncate text-[11px] text-muted-foreground md:text-xs">Reach customers browsing local food offers</div>
        </div>
      </div>
      <Cta href={ctaHref} compact className="hidden sm:inline-flex" />
    </div>
  );
}

function TallLayout({ ctaHref }: { ctaHref: string }) {
  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-between gap-4 p-5 text-center">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
          <Sparkles className="h-3 w-3" /> Advertise
        </div>
        <h3 className="mt-3 text-lg font-bold leading-tight">Your business could be here.</h3>
        <p className="mt-1 text-xs text-muted-foreground">Reach customers browsing nearby offers.</p>
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
    <div className={cn("flex items-center gap-2 rounded-xl border bg-background/70 px-3 py-2", tight && "px-2 py-1.5")}>
      <Icon className="h-4 w-4 text-primary" />
      <div className="text-left leading-tight">
        <div className="text-sm font-bold">{k}</div>
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{v}</div>
      </div>
    </div>
  );
}

function ContactLine({ compact }: { compact?: boolean }) {
  return (
    <div className={cn("inline-flex items-center gap-1.5 font-medium text-muted-foreground", compact ? "text-[11px]" : "text-xs")}>
      <Mail className="h-3.5 w-3.5" />
      {AD_EMAIL}
    </div>
  );
}

function Cta({ href, className, compact }: { href: string; className?: string; compact?: boolean }) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-primary text-primary-foreground shadow-sm transition hover:bg-primary/90 hover:shadow-md",
        compact ? "px-3 py-1.5 text-xs font-semibold" : "px-4 py-2 text-sm font-semibold",
        className,
      )}
    >
      Advertise
      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
    </a>
  );
}
