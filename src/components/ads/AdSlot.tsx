import { cn } from "@/lib/utils";
import { Sparkles, TrendingUp, Users, MapPin, ArrowRight, Mail, Store, Megaphone } from "lucide-react";

type AdSize = "leaderboard" | "billboard" | "rectangle" | "square" | "skyscraper" | "mobile-banner" | "inline";

const SIZE_CLASSES: Record<AdSize, string> = {
  leaderboard: "min-h-36 md:min-h-44",
  billboard: "min-h-56 md:min-h-72",
  rectangle: "min-h-80",
  square: "aspect-square",
  skyscraper: "h-[620px] w-[180px]",
  "mobile-banner": "min-h-24",
  inline: "min-h-40 md:min-h-48",
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
        "group relative mx-auto w-full max-w-6xl overflow-hidden rounded-[2rem]",
        "bg-gradient-to-br from-primary via-emerald-600 to-accent text-primary-foreground",
        "shadow-[0_28px_90px_-35px_hsl(var(--primary)/0.85)] ring-1 ring-white/25",
        SIZE_CLASSES[size],
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-75 mix-blend-soft-light" style={{ backgroundImage: "radial-gradient(circle at 12% 18%, rgba(255,255,255,0.7), transparent 36%), radial-gradient(circle at 88% 82%, rgba(255,255,255,0.45), transparent 42%)" }} />
      <div className="pointer-events-none absolute inset-0 opacity-[0.09]" style={{ backgroundImage: "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
      <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 -bottom-16 h-64 w-64 rounded-full bg-accent/45 blur-3xl" />

      <span className="absolute right-4 top-4 z-10 rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm ring-1 ring-white/25">
        Premium ad space
      </span>

      {isTall ? <TallLayout ctaHref={ctaHref} /> : isSlim ? <SlimLayout ctaHref={ctaHref} /> : isCompact ? <CompactLayout ctaHref={ctaHref} /> : <FullLayout ctaHref={ctaHref} />}
    </aside>
  );
}

function FullLayout({ ctaHref }: { ctaHref: string }) {
  return (
    <div className="relative z-10 flex h-full items-center justify-between gap-6 px-6 py-7 md:px-10 md:py-9">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold backdrop-blur-sm">
          <Sparkles className="h-3 w-3" /> Prime sponsor placement
        </div>
        <h3 className="mt-3 text-2xl font-bold leading-tight md:text-4xl">
          Put your business in front of Last Bite customers.
        </h3>
        <p className="mt-2 max-w-xl text-sm opacity-95 md:text-base">
          A high-visibility spot for cafés, restaurants, grocers and local brands across Brunei.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Cta href={ctaHref} />
          <ContactLine />
        </div>
      </div>
      <div className="hidden shrink-0 grid-cols-1 gap-2 sm:grid">
        <Stat icon={Users} k="Food buyers" v="active audience" />
        <Stat icon={MapPin} k="Brunei-wide" v="local reach" />
        <Stat icon={TrendingUp} k="Premium" v="visibility" />
      </div>
    </div>
  );
}

function CompactLayout({ ctaHref }: { ctaHref: string }) {
  return (
    <div className="relative z-10 flex h-full flex-col justify-between gap-4 p-6">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm">
          <Store className="h-3 w-3" /> Sponsor spotlight
        </div>
        <h3 className="mt-3 text-2xl font-bold leading-tight">Advertise your business here.</h3>
        <p className="mt-2 text-sm opacity-95">Reach customers browsing food offers across Brunei.</p>
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
    <div className="relative z-10 flex h-full items-center justify-between gap-5 px-5 py-5 md:px-8">
      <div className="flex min-w-0 items-center gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20">
          <Megaphone className="h-7 w-7" />
        </div>
        <div className="min-w-0 pr-20 md:pr-0">
          <div className="text-lg font-bold leading-tight md:text-2xl">Advertise on Last Bite</div>
          <div className="mt-1 truncate text-xs opacity-90 md:text-sm">Premium placement for local food and lifestyle brands</div>
          <div className="mt-2 hidden text-xs font-medium opacity-90 md:block">Contact {AD_EMAIL}</div>
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
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm">
          <Sparkles className="h-3 w-3" /> Sponsor space
        </div>
        <h3 className="mt-4 text-xl font-bold leading-tight">Your business could be here.</h3>
        <p className="mt-2 text-xs opacity-95">Reach customers browsing nearby offers.</p>
      </div>
      <div className="grid w-full gap-2">
        <Stat icon={Users} k="Customers" v="browsing" tight />
        <Stat icon={TrendingUp} k="Premium" v="visibility" tight />
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
    <div className={cn("flex items-center gap-2 rounded-xl bg-white/12 px-3 py-2 backdrop-blur-sm ring-1 ring-white/15", tight && "px-2 py-1.5")}>
      <Icon className="h-4 w-4 opacity-90" />
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
      {AD_EMAIL}
    </div>
  );
}

function Cta({ href, className, compact }: { href: string; className?: string; compact?: boolean }) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-white text-primary shadow-sm transition hover:bg-white/90 hover:shadow-md",
        compact ? "px-4 py-2 text-xs font-semibold" : "px-5 py-2.5 text-sm font-semibold",
        className,
      )}
    >
      Advertise with us
      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
    </a>
  );
}
