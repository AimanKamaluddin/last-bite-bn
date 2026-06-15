import { cn } from "@/lib/utils";
import { Megaphone } from "lucide-react";

type AdSize = "leaderboard" | "billboard" | "rectangle" | "square" | "skyscraper" | "mobile-banner" | "inline";

const SIZE_CLASSES: Record<AdSize, string> = {
  // Standard IAB-ish sizes mapped to responsive Tailwind heights
  leaderboard: "h-24 md:h-28", // ~728x90
  billboard: "h-32 md:h-48", // ~970x250
  rectangle: "h-64", // ~300x250
  square: "aspect-square", // 250x250
  skyscraper: "h-[600px] w-[160px]", // 160x600
  "mobile-banner": "h-16", // 320x50
  inline: "h-40",
};

const SIZE_LABEL: Record<AdSize, string> = {
  leaderboard: "728 × 90",
  billboard: "970 × 250",
  rectangle: "300 × 250",
  square: "250 × 250",
  skyscraper: "160 × 600",
  "mobile-banner": "320 × 50",
  inline: "Responsive",
};

interface AdSlotProps {
  size?: AdSize;
  label?: string;
  className?: string;
  id?: string;
}

/**
 * Placeholder ad slot. Replace inner content with an ad network embed
 * (Google AdSense, direct sponsor, etc.) when monetization goes live.
 * The `id` prop is intended to match an ad-network slot identifier.
 */
export function AdSlot({ size = "leaderboard", label, className, id }: AdSlotProps) {
  return (
    <aside
      role="complementary"
      aria-label={label ?? "Advertisement"}
      data-ad-slot={id ?? size}
      className={cn(
        "relative mx-auto flex w-full max-w-5xl items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-muted/40 text-muted-foreground",
        SIZE_CLASSES[size],
        className,
      )}
    >
      <div className="pointer-events-none flex flex-col items-center gap-1 text-center px-4">
        <Megaphone className="h-5 w-5 opacity-60" />
        <div className="text-xs font-semibold uppercase tracking-widest opacity-70">
          Advertisement
        </div>
        <div className="text-[10px] opacity-50">
          {label ?? "Your ad here"} · {SIZE_LABEL[size]}
        </div>
      </div>
    </aside>
  );
}
