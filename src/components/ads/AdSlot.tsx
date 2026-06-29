type AdSize = "leaderboard" | "billboard" | "rectangle" | "square" | "skyscraper" | "mobile-banner" | "inline";

interface AdSlotProps {
  size?: AdSize;
  label?: string;
  className?: string;
  id?: string;
  slotCode?: string;
  ctaHref?: string;
}

export function AdSlot(_props: AdSlotProps) {
  return null;
}
