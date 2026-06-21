import { cn } from "@/lib/utils";
import { Sparkles, TrendingUp, Users, MapPin, ArrowRight } from "lucide-react";

type AdSize = "leaderboard" | "billboard" | "rectangle" | "square" | "skyscraper" | "mobile-banner" | "inline";

const SIZE_CLASSES: Record<AdSize, string> = {
  leaderboard: "h-28 md:h-32",
  billboard: "h-40 md:h-56",
  rectangle: "h-64",
  square: "aspect-square",
  skyscraper: "h-[600px] w-[160px]",
  "mobile-banner": "h-20",
  inline: "h-44",
};

interface AdSlotProps {
  size?: AdSize;
  label?: string;
  className?: string;
  id?: string;
  /** Where the "Advertise with us" CTA goes. Defaults to a mailto. */
  ctaHref?: string;
}

const DEFAULT_CTA = "mailto:ads@lastbite.bn?subject=Advertise%20on%20Last%20Bite";

/**
 * House ad slot — when no paid creative is sold, this renders a polished
 * "Advertise with us" pitch designed to convert merchants into ad buyers.
 * Replace with an ad-network embed once monetization is live.
 */
export function AdSlot({ size = "leaderboard", label, className, id, ctaHref = DEFAULT_CTA }: AdSlotProps) {
  const isSlim = size === "leaderboard" || size === "mobile-banner";
  const isTall = size === "skyscraper";
  const isCompact = size === "rectangle" || size === "square" || size === "inline" || isSlim;

  return (
    <aside
      role="complementary"
      aria-label={label ?? "Sponsored placement available"}
      data-ad-slot={id ?? size}
      className={cn(
        "group relative mx-auto w-full max-w-5xl overflow-hidden rounded-3xl",
        "bg-gradient-to-br from-primary/95 via-primary to-accent text-primary-foreground",
        "shadow-[0_20px_60px_-25px_hsl(var(--primary)/0.6)] ring-1 ring-primary/20",
        SIZE_CLASSES[size],
        className,
      )}
    >
      {/* Decorative glow + grid */}
      <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-soft-light"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.45), transparent 45%), radial-gradient(circle at 85% 80%, rgba(255,255,255,0.3), transparent 50%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-accent/40 blur-3xl" />

      {/* Sponsored micro-label */}
      <span className="absolute right-3 top-3 z-10 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider backdrop-blur-sm">
        Sponsored slot
      </span>

      {isTall ? <TallLayout ctaHref={ctaHref} /> : isSlim ? <SlimLayout ctaHref={ctaHref} /> : isCompact ? <CompactLayout ctaHref={ctaHref} /> : <FullLayout ctaHref={ctaHref} />}
    </aside>
  );
}

function FullLayout({ ctaHref }: { ctaHref: string }) {
  return (
    <div className="relative z-10 flex h-full items-center justify-between gap-6 px-6 md:px-10">
      <div className="max-w-xl">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">
          <Sparkles className="h-3 w-3" /> Reach hungry Bruneians
        </div>
        <h3 className="mt-2 text-xl font-bold leading-tight md:text-3xl">
          Put your brand in front of every local foodie.
        </h3>
        <p className="mt-1 text-sm opacity-90 md:text-base">
          Premium placement across Last Bite — homepage, browse, and listings.
        </p>
        <Cta href={ctaHref} className="mt-3" />
      </div>
      <div className="hidden shrink-0 grid-cols-1 gap-2 sm:grid">
        <Stat icon={Users} k="10k+" v="monthly visitors" />
        <Stat icon={MapPin} k="4" v="districts" />
        <Stat icon={TrendingUp} k="3.2×" v="avg. CTR vs social" />
      </div>
    </div>
  );
}

function CompactLayout({ ctaHref }: { ctaHref: string }) {
  return (
    <div className="relative z-10 flex h-full flex-col justify-between gap-2 p-5">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm">
          <Sparkles className="h-3 w-3" /> Sponsored spot
        </div>
        <h3 className="mt-2 text-lg font-bold leading-tight">Your brand, right here.</h3>
        <p className="mt-1 text-xs opacity-90">Reach 10k+ Bruneian foodies every month.</p>
      </div>
      <Cta href={ctaHref} />
    </div>
  );
}

function SlimLayout({ ctaHref }: { ctaHref: string }) {
  return (
    <div className="relative z-10 flex h-full items-center justify-between gap-4 px-5 md:px-8">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15 backdrop-blur-sm">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold leading-tight md:text-base">Advertise to Bruneian foodies</div>
          <div className="truncate text-[11px] opacity-85 md:text-xs">10k+ monthly visitors · 4 districts · premium placement</div>
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
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm">
          <Sparkles className="h-3 w-3" /> Sponsored
        </div>
        <h3 className="mt-3 text-lg font-bold leading-tight">Your ad here.</h3>
        <p className="mt-1 text-xs opacity-90">Vertical real-estate beside every listing.</p>
      </div>
      <div className="grid w-full gap-2">
        <Stat icon={Users} k="10k+" v="monthly" tight />
        <Stat icon={TrendingUp} k="3.2×" v="CTR" tight />
      </div>
      <Cta href={ctaHref} />
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
