import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin } from "lucide-react";
import { formatBND } from "@/lib/sample-data";
import { formatTime12Hour } from "@/lib/time";
import { VendorBrand } from "@/components/merchants/VendorBrand";

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
  merchant: { id?: string | null; business_name: string; business_type?: string | null; district: string; rating: number; image_url?: string | null };
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
    <Card className="touch-card group overflow-hidden rounded-2xl border-border/60 p-0 shadow-sm transition hover:shadow-lg sm:rounded-3xl">
      <Link to="/listing/$id" params={{ id: listing.id }} className="relative block h-32 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:h-44" aria-label={`View details for ${listing.title}`}>
        <img src={listing.image_url} alt={listing.title} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
        <Badge className="absolute left-2 top-2 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-accent-foreground sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs">-{discountPct}%</Badge>
        {unavailable && <div className="absolute inset-0 grid place-items-center bg-background/75 text-sm font-semibold">{expired ? "Offer expired" : "Sold out"}</div>}
      </Link>
      <div className="space-y-2 p-3 sm:space-y-3 sm:p-4">
        <VendorBrand merchant={listing.merchant} variant="inline" />
        <div>
          <Link to="/listing/$id" params={{ id: listing.id }} className="font-semibold leading-tight hover:text-primary hover:underline"><h3 className="line-clamp-2 text-sm leading-snug sm:text-base">{listing.title}</h3></Link>
          <p className="mt-1 text-xs font-medium text-muted-foreground">Sold by {listing.merchant.business_name}</p>
        </div>
        <div className="grid gap-1 rounded-xl bg-muted/45 p-2 text-[11px] text-muted-foreground sm:flex sm:flex-wrap sm:items-center sm:gap-3 sm:rounded-2xl sm:bg-transparent sm:p-0 sm:text-xs">
          <span className="inline-flex min-w-0 items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{listing.merchant.district}</span></span>
          <span className="inline-flex min-w-0 items-center gap-1.5 font-medium text-foreground"><Clock className="h-3.5 w-3.5 shrink-0 text-primary" /><span className="truncate">Pickup: {fmtTime(listing.pickup_start)} – {fmtTime(listing.pickup_end)}</span></span>
          {expired && <Badge variant="outline" className="w-fit rounded-full text-[10px]">Offer expired</Badge>}
        </div>
        <div className="flex items-end justify-between gap-2 pt-0.5 sm:gap-3 sm:pt-1">
          <div className="min-w-0">
            <div className="text-[11px] text-muted-foreground line-through sm:text-xs">{formatBND(listing.original_price)}</div>
            <div className="text-xl font-black leading-none text-primary sm:text-xl">{formatBND(listing.discounted_price)}</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground sm:mt-1 sm:text-xs">{expired ? "Pickup ended" : `${listing.quantity_available} left`}</div>
          </div>
          <Button asChild size="sm" className="h-9 shrink-0 rounded-full px-3 text-xs font-bold sm:h-10 sm:px-5 sm:text-sm" disabled={unavailable}>
            <Link to="/listing/$id" params={{ id: listing.id }}>{unavailable ? expired ? "Expired" : "Sold out" : "Reserve"}</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
