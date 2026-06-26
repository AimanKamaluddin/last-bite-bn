import { cn } from "@/lib/utils";
import { Sparkles, TrendingUp, Users, MapPin, ArrowRight, Mail, Store, Megaphone } from "lucide-react";

type AdSize = "leaderboard" | "billboard" | "rectangle" | "square" | "skyscraper" | "mobile-banner" | "inline";

const SIZE_CLASSES: Record<AdSize, string> = {
  leaderboard: "min-h-32 sm:min-h-36 md:min-h-44",
  billboard: "min-h-48 sm:min-h-56 md:min-h-72",
  rectangle: "min-h-72 sm:min-h-80",
  square: "aspect-square",
  skyscraper: "h-[520px] w-full sm:h-[620px] sm:w-[180px]",
  "mobile-banner": "min-h-24",
  inline: "min-h-36 sm:min-h-40 md:min-h-48",
};

interface AdSlotProps {
  size?: AdSize;
  label?: string;
  className?: string;
  id?: string;
  slotCode?: string;
  ctaHref?: string;
}

const AD_EMAIL = "lastbite.bn@gmail.com";
const DEFAULT_CTA = `mailto:${AD_EMAIL}?subject=Advertise%20on%20Last%20Bite`;

function formatSlotCode(id?: string) {
  if (!id) return "AD SPACE";
  return id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function AdSlot({ size = "leaderboard", label, className, id, slotCode, ctaHref = DEFAULT_CTA }: AdSlotProps) {
  const isSlim = size === "leaderboard" || size === "mobile-banner" || size === "inline";
  const isTall = size === "skyscraper";
  const isCompact = size === "rectangle" || size === "square";
  const code = slotCode ?? formatSlotCode(id);

  return (
    <aside
      role="complementary"
      aria-label={label ?? `${code} sponsored space`}
      data-ad-slot={id ?? size}
      className={cn(
        "group relative mx-auto w-full max-w-6xl overflow-hidden rounded-[1.75rem] sm:rounded-[2rem]",
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

      <span className="absolute left-3 top-3 z-10 rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-primary shadow-md sm:left-4 sm:top-4 sm:px-3 sm:text-[11px]">
        {code}
      </span>
      <span className="absolute right-3 top-3 z-10 rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm ring-1 ring-white/25 sm:right-4 sm:top-4 sm:px-3 sm:text-[10px]">
        Premium ad space
      </span>

      {isTall ? <TallLayout ctaHref={ctaHref} code={code} /> : isSlim ? <SlimLayout ctaHref={ctaHref} code={code} /> : isCompact ? <CompactLayout ctaHref={ctaHref} code={code} /> : <FullLayout ctaHref={ctaHref} code={code} />}
    </aside>
  );
}

function FullLayout({ ctaHref, code }: { ctaHref: string; code: string }) {
  return (
    <div className="relative z-10 flex h-full items-end justify-between gap-4 px-4 py-5 pt-16 sm:px-6 sm:py-7 md:items-center md:px-10 md:py-9 md:pt-16">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold backdrop-blur-sm">
          <Sparkles className="h-3 w-3" /> {code} · Prime sponsor placement
        </div>
        <h3 className="mt-2 text-xl font-bold leading-tight sm:mt-3 sm:text-2xl md:text-4xl">
          Put your business in front of Last Bite customers.
        </h3>
        <p className="mt-2 max-w-xl text-xs opacity-95 sm:text-sm md:text-base">
          A high-visibility spot for cafés, restaurants, grocers and local brands across Brunei.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4 sm:gap-3">
          <Cta href={ctaHref} />
          <ContactLine />
        </div>
      </div>
      <div className="hidden shrink-0 grid-cols-1 gap-2 md:grid">
        <Stat icon={Users} k="Food buyers" v="active audience" />
        <Stat icon={MapPin} k="Brunei-wide" v="local reach" />
        <Stat icon={TrendingUp} k="Premium" v="visibility" />
      </div>
    </div>
  );
}

function CompactLayout({ ctaHref, code }: { ctaHref: string; code: string }) {
  return (
    <div className="relative z-10 flex h-full flex-col justify-between gap-4 p-5 pt-14 sm:p-6 sm:pt-16">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm">
          <Store className="h-3 w-3" /> {code}
        </div>
        <h3 className="mt-3 text-xl font-bold leading-tight sm:text-2xl">Advertise your business here.</h3>
        <p className="mt-2 text-xs opacity-95 sm:text-sm">Reach customers browsing food offers across Brunei.</p>
      </div>
      <div className="space-y-2">
        <Cta href={ctaHref} />
        <ContactLine compact />
      </div>
    </div>
  );
}

function SlimLayout({ ctaHref, code }: { ctaHref: string; code: string }) {
  return (
    <div className="relative z-10 flex h-full items-end justify-between gap-4 px-4 py-4 pt-14 sm:items-center sm:px-5 sm:py-5 md:px-8 md:pt-12">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20 sm:h-14 sm:w-14">
          <Megaphone className="h-5 w-5 sm:h-7 sm:w-7" />
        </div>
        <div className="min-w-0 pr-16 sm:pr-20 md:pr-0">
          <div className="text-base font-bold leading-tight sm:text-lg md:text-2xl">Advertise on Last Bite</div>
          <div className="mt-1 line-clamp-2 text-[11px] opacity-90 sm:truncate sm:text-xs md:text-sm">{code} · Premium placement for local food and lifestyle brands</div>
          <div className="mt-2 hidden text-xs font-medium opacity-90 md:block">Contact {AD_EMAIL}</div>
        </div>
      </div>
      <Cta href={ctaHref} compact className="hidden sm:inline-flex" />
    </div>
  );
}

function TallLayout({ ctaHref, code }: { ctaHref: string; code: string }) {
  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-between gap-4 p-5 pt-16 text-center">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm">
          <Sparkles className="h-3 w-3" /> {code}
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
      <span className="break-all">{AD_EMAIL}</span>
    </div>
  );
}

function Cta({ href, className, compact }: { href: string; className?: string; compact?: boolean }) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-white text-primary shadow-sm transition hover:bg-white/90 hover:shadow-md",
        compact ? "px-4 py-2 text-xs font-semibold" : "px-4 py-2 text-xs font-semibold sm:px-5 sm:py-2.5 sm:text-sm",
        className,
      )}
    >
      Advertise with us
      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
    </a>
  );
}
