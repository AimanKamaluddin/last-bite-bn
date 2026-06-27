import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Star } from "lucide-react";
import { formatBND } from "@/lib/sample-data";
import { formatTime12Hour } from "@/lib/time";

export type ListingCardData = {
  id: string;
  title: string;
  image_url: string;
  category: string;
  original_price: number;
  discounted_price: number;
  quantity_available: number;
  pickup_start: string;
  pickup_end: string;
  created_at?: string;
  produced_at?: string | null;
  merchant: { business_name: string; district: string; rating: number };
};

const fmtTime = (t: string) => formatTime12Hour(t);

const isPastPickup = (pickupEnd: string) => {
  const end = new Date(pickupEnd);
  return !Number.isNaN(end.getTime()) && end.getTime() < Date.now();
};

export function ListingCard({ listing }: { listing: ListingCardData }) {
  const soldOut = listing.quantity_available <= 0;
  const expired = isPastPickup(listing.pickup_end);
  const unavailable = soldOut || expired;
  const discountPct = Math.round((1 - listing.discounted_price / Math.max(listing.original_price, 0.01)) * 100);

  return (
    <Card className="touch-card group overflow-hidden rounded-[1.35rem] border-border/60 p-0 shadow-sm transition hover:shadow-lg sm:rounded-3xl">
      <Link to="/listing/$id" params={{ id: listing.id }} className="relative block h-52 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:h-44" aria-label={`View details for ${listing.title}`}>
        <img src={listing.image_url} alt={listing.title} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
        <Badge className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">-{discountPct}%</Badge>
        <span className="absolute right-3 bottom-3 rounded-full bg-background/95 px-3 py-1.5 text-xs font-semibold shadow sm:opacity-0 sm:transition sm:group-hover:opacity-100">View details →</span>
        {unavailable && <div className="absolute inset-0 grid place-items-center bg-background/75 text-sm font-semibold">{expired ? "Offer expired" : "Sold out"}</div>}
      </Link>
      <div className="space-y-3 p-4 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to="/listing/$id" params={{ id: listing.id }} className="font-semibold leading-tight hover:text-primary hover:underline"><h3 className="line-clamp-2 text-[1.05rem] leading-snug sm:text-base">{listing.title}</h3></Link>
            <p className="mt-1 truncate text-sm text-muted-foreground">{listing.merchant.business_name}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium"><Star className="h-3.5 w-3.5 fill-sun text-sun" />{listing.merchant.rating?.toFixed(1) ?? "—"}</div>
        </div>
        <div className="grid gap-2 rounded-2xl bg-muted/45 p-3 text-xs text-muted-foreground sm:flex sm:flex-wrap sm:items-center sm:gap-3 sm:bg-transparent sm:p-0">
          <span className="inline-flex min-w-0 items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{listing.merchant.district}</span></span>
          <span className="inline-flex min-w-0 items-center gap-1.5 font-medium text-foreground"><Clock className="h-3.5 w-3.5 shrink-0 text-primary" /><span className="truncate">Pickup window: {fmtTime(listing.pickup_start)} – {fmtTime(listing.pickup_end)}</span></span>
          {expired && <Badge variant="outline" className="w-fit rounded-full text-[10px]">Offer expired</Badge>}
        </div>
        <div className="flex items-end justify-between gap-3 pt-1">
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground line-through">{formatBND(listing.original_price)}</div>
            <div className="text-2xl font-black leading-none text-primary sm:text-xl">{formatBND(listing.discounted_price)}</div>
            <div className="mt-1 text-xs text-muted-foreground">{expired ? "Pickup window ended" : `${listing.quantity_available} left`}</div>
          </div>
          <Button asChild size="sm" className="h-11 shrink-0 rounded-full px-5 font-bold sm:h-10" disabled={unavailable}>
            <Link to="/listing/$id" params={{ id: listing.id }}>{unavailable ? expired ? "Expired" : "Sold out" : "Reserve"}</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}