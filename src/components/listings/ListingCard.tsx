import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Star } from "lucide-react";
import { formatBND, halalLabel } from "@/lib/sample-data";

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
  halal_info?: string;
  merchant: {
    business_name: string;
    district: string;
    rating: number;
    halal_status?: string;
  };
};

const fmtTime = (t: string) => {
  if (!t) return "";
  // Accept HH:mm or ISO timestamp
  if (t.length <= 5) return t;
  try {
    return new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return t;
  }
};

export function ListingCard({ listing }: { listing: ListingCardData }) {
  const soldOut = listing.quantity_available <= 0;
  const discountPct = Math.round(
    (1 - listing.discounted_price / Math.max(listing.original_price, 0.01)) * 100,
  );
  return (
    <Card className="group overflow-hidden rounded-3xl border-border/60 p-0 transition hover:shadow-lg">
      <div className="relative h-44 overflow-hidden">
        <img
          src={listing.image_url}
          alt={listing.title}
          loading="lazy"
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
        <Badge className="absolute left-3 top-3 rounded-full bg-accent text-accent-foreground">
          -{discountPct}%
        </Badge>
        {soldOut && (
          <div className="absolute inset-0 grid place-items-center bg-background/70 text-sm font-semibold">
            Sold out
          </div>
        )}
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold leading-tight">{listing.title}</h3>
            <p className="text-sm text-muted-foreground">{listing.merchant.business_name}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1 text-sm">
            <Star className="h-3.5 w-3.5 fill-sun text-sun" />
            {listing.merchant.rating?.toFixed(1) ?? "—"}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {listing.merchant.district}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {fmtTime(listing.pickup_start)} – {fmtTime(listing.pickup_end)}
          </span>
          {listing.merchant.halal_status && (
            <Badge variant="secondary" className="rounded-full">
              {halalLabel(listing.merchant.halal_status)}
            </Badge>
          )}
        </div>

        <div className="flex items-end justify-between pt-1">
          <div>
            <div className="text-xs text-muted-foreground line-through">
              {formatBND(listing.original_price)}
            </div>
            <div className="text-xl font-bold text-primary">
              {formatBND(listing.discounted_price)}
            </div>
            <div className="text-xs text-muted-foreground">
              {listing.quantity_available} left
            </div>
          </div>
          <Button asChild size="sm" className="rounded-full" disabled={soldOut}>
            <Link to="/listing/$id" params={{ id: listing.id }}>
              {soldOut ? "Sold out" : "Reserve"}
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
