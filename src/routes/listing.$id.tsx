import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { sampleListings, formatBND, type SampleListing } from "@/lib/sample-data";
import { ListingCard, type ListingCardData } from "@/components/listings/ListingCard";
import { PickupWindowAlert } from "@/components/orders/PickupWindowAlert";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  AlertTriangle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Star,
  Utensils,
} from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";
import { ReviewList } from "@/components/reviews/ReviewList";
import { toast } from "sonner";

export const Route = createFileRoute("/listing/$id")({ component: ListingDetail });

const isPastPickup = (pickupEnd: string) => {
  const end = new Date(pickupEnd);
  return !Number.isNaN(end.getTime()) && end.getTime() < Date.now();
};

const formatDateWithDay = (iso?: string | null) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
};

const formatDateTime = (iso?: string | null) => {
  if (!iso) return "";
  try {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleString([], {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

const getProducedAt = (listing: any) => {
  const candidates = [
    listing?.produced_at,
    listing?.production_at,
    listing?.production_datetime,
    listing?.made_at,
    listing?.created_at,
  ];

  return candidates.find((value) => typeof value === "string" && formatDateTime(value)) ?? null;
};

const getListingImages = (listing: any) => {
  const images = [
    listing?.image_url,
    ...(Array.isArray(listing?.images) ? listing.images : []),
    ...(Array.isArray(listing?.image_urls) ? listing.image_urls : []),
    ...(Array.isArray(listing?.gallery_images) ? listing.gallery_images : []),
  ].filter((url): url is string => typeof url === "string" && url.trim().length > 0);

  return Array.from(new Set(images));
};

function ListingDetail() {
  const { id } = Route.useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<ListingCardData[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    (async () => {
      const local = sampleListings.find((listing) => listing.id === id);

      if (local) {
        setData(local);
        setRelated(
          sampleListings
            .filter((listing) => listing.merchant.id === local.merchant.id && listing.id !== local.id)
            .map((listing) => toCardData(listing)),
        );
        setLoading(false);
        return;
      }

      const { data: listing } = await (supabase as any).from("listings").select("*").eq("id", id).maybeSingle();

      if (listing) {
        const { data: merchant } = await (supabase as any)
          .from("merchants_public")
          .select("business_name, district, rating, business_type, image_url")
          .eq("id", listing.merchant_id)
          .maybeSingle();

        setData({
          ...listing,
          merchant: {
            business_name: merchant?.business_name ?? "",
            district: merchant?.district ?? "",
            address: "",
            rating: Number(merchant?.rating ?? 0),
            business_type: merchant?.business_type ?? "",
            image_url: merchant?.image_url ?? null,
          },
        });

        const { data: others } = await (supabase as any)
          .from("listings")
          .select("*")
          .eq("merchant_id", listing.merchant_id)
          .eq("status", "active")
          .neq("id", id)
          .gt("quantity_available", 0)
          .limit(6);

        if (others && merchant) {
          setRelated(
            others.map((offer: any) => ({
              id: offer.id,
              title: offer.title,
              image_url: offer.image_url,
              category: offer.category,
              original_price: Number(offer.original_price),
              discounted_price: Number(offer.discounted_price),
              quantity_available: offer.quantity_available,
              pickup_start: offer.pickup_start,
              pickup_end: offer.pickup_end,
              created_at: offer.created_at,
              produced_at: getProducedAt(offer),
              merchant: {
                business_name: merchant.business_name ?? "",
                district: merchant.district ?? "",
                rating: Number(merchant.rating ?? 0),
                image_url: merchant.image_url ?? null,
              },
            })),
          );
        }
      }

      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [id]);

  if (loading) {
    return (
      <SiteLayout>
        <div className="container mx-auto p-6 sm:p-10">Loading…</div>
      </SiteLayout>
    );
  }

  if (!data) {
    return (
      <SiteLayout>
        <div className="container mx-auto p-6 text-center sm:p-10">
          <h1 className="text-2xl font-bold">Listing not found</h1>
          <Button asChild className="mt-4 rounded-full">
            <Link to="/browse">Back to browse</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const soldOut = data.quantity_available <= 0;
  const expired = isPastPickup(data.pickup_end);
  const unavailable = soldOut || expired;
  const listingImages = getListingImages(data);
  const selectedImage = listingImages[selectedImageIndex] ?? data.image_url;
  const hasMultipleImages = listingImages.length > 1;
  const producedAt = getProducedAt(data);
  const producedText = formatDateTime(producedAt);

  const showPreviousImage = () => setSelectedImageIndex((index) => (index - 1 + listingImages.length) % listingImages.length);
  const showNextImage = () => setSelectedImageIndex((index) => (index + 1) % listingImages.length);

  const reserve = () => {
    if (expired) {
      toast.error("This offer has expired.");
      return;
    }

    if (!isAuthenticated) {
      toast.info("Please sign in to reserve.");
      navigate({ to: "/auth", search: { redirect: `/listing/${id}` } });
      return;
    }

    navigate({ to: "/checkout/$id", params: { id } });
  };

  return (
    <SiteLayout>
      <section className="container mx-auto grid gap-6 px-3 py-6 pb-44 sm:px-4 sm:py-10 md:grid-cols-[1.2fr_1fr] md:gap-10 md:pb-10">
        <div>
          <div className="relative overflow-hidden rounded-3xl bg-muted">
            <img src={selectedImage} alt={data.title} className="aspect-[4/3] w-full object-cover" />
            {hasMultipleImages && (
              <>
                <Button type="button" variant="secondary" size="icon" className="absolute left-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-background/90 shadow-md hover:bg-background" onClick={showPreviousImage} aria-label="Previous photo">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button type="button" variant="secondary" size="icon" className="absolute right-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-background/90 shadow-md hover:bg-background" onClick={showNextImage} aria-label="Next photo">
                  <ChevronRight className="h-5 w-5" />
                </Button>
                <div className="absolute bottom-3 right-3 rounded-full bg-black/65 px-3 py-1 text-xs font-medium text-white">
                  {selectedImageIndex + 1}/{listingImages.length}
                </div>
              </>
            )}
          </div>

          {hasMultipleImages && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible">
              {listingImages.slice(0, 8).map((imageUrl, index) => (
                <button key={imageUrl} type="button" onClick={() => setSelectedImageIndex(index)} className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-muted transition sm:aspect-square sm:h-auto sm:w-full ${selectedImageIndex === index ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-primary/50"}`} aria-label={`View photo ${index + 1}`} aria-current={selectedImageIndex === index ? "true" : undefined}>
                  <img src={imageUrl} alt={`${data.title} photo ${index + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <h1 className="mt-5 text-3xl font-bold leading-tight md:mt-6 md:text-4xl">{data.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">{data.merchant.business_name} · {data.merchant.district}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary" className="rounded-full">{data.category}</Badge>
            <Badge variant="secondary" className="rounded-full"><Star className="mr-1 h-3 w-3 fill-sun text-sun" /> {data.merchant.rating?.toFixed(1) ?? "—"}</Badge>
            {expired && <Badge variant="outline" className="rounded-full">Offer expired</Badge>}
          </div>

          <Card className="mt-5 rounded-[1.75rem] border-primary/10 bg-gradient-to-br from-white via-primary/5 to-accent/10 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-black leading-tight">Produced date & time</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{producedText}</p>
              </div>
            </div>
          </Card>

          <Card className="mt-5 rounded-[1.75rem] border-primary/10 bg-gradient-to-br from-white via-primary/5 to-accent/10 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Utensils className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-black leading-tight">About this food</h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{data.description || "No description has been provided for this offer yet."}</p>
              </div>
            </div>
          </Card>

          <div className="mt-5">
            <PickupWindowAlert pickupStart={data.pickup_start} pickupEnd={data.pickup_end} />
          </div>

          <Card className="mt-5 rounded-3xl border-primary/20 p-4 shadow-sm md:hidden">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-sm text-muted-foreground line-through">{formatBND(Number(data.original_price))}</div>
                <div className="text-3xl font-bold leading-none text-primary">{formatBND(Number(data.discounted_price))}</div>
              </div>
              <div className="text-right text-xs font-medium text-muted-foreground">{expired ? "Pickup ended" : `${data.quantity_available} left`}</div>
            </div>
            <Button className="mt-4 h-14 w-full rounded-full text-base font-bold" onClick={reserve} disabled={unavailable}>{expired ? "Expired" : soldOut ? "Sold out" : "Reserve"}</Button>
            <p className="mt-3 text-center text-xs font-medium text-amber-700">Pickup only during the pickup window.</p>
          </Card>

          <div className="mt-7">
            <AdSlot size="inline" id="ad-space-12-listing-midpage" slotCode="AD SPACE 12" label="AD SPACE 12 listing middle" />
          </div>

          <Card className="mt-7 rounded-2xl p-4 md:mt-8">
            <h2 className="text-lg font-semibold">Listing details</h2>
            <div className="mt-3 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              <div className="flex items-start gap-2"><CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span><strong className="text-foreground">Listed:</strong><br />{formatDateWithDay(data.created_at)}</span></div>
              <div className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span><strong className="text-foreground">Produced:</strong><br />{producedText}</span></div>
            </div>
          </Card>

          <h2 className="mt-7 text-lg font-semibold md:mt-8">Customer reviews</h2>
          <ReviewList listingId={data.id} />

          <h2 className="mt-7 text-lg font-semibold md:mt-8">Allergen info</h2>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{data.allergen_info || "Ask the merchant for allergen details."}</li>
          </ul>

          <h2 className="mt-7 text-lg font-semibold md:mt-8">Pickup location</h2>
          <Card className="mt-2 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 shrink-0 text-primary" />{data.merchant.address || `${data.merchant.business_name}, ${data.merchant.district}`}</div>
            <div className="mt-3 grid h-36 place-items-center rounded-xl bg-muted text-xs text-muted-foreground sm:h-40">Map preview (coming soon)</div>
          </Card>
        </div>

        <aside className="hidden md:block">
          <div className="sticky top-24 space-y-4">
            <Card className="rounded-3xl p-6">
              <PriceBox data={data} expired={expired} soldOut={soldOut} unavailable={unavailable} reserve={reserve} />
            </Card>
            <AdSlot size="rectangle" id="ad-space-11-listing-sidebar" slotCode="AD SPACE 11" label="AD SPACE 11 listing sidebar" />
          </div>
        </aside>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/98 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-2xl backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-xl gap-3">
          <Button className="h-14 w-full rounded-full text-base font-bold shadow-lg" onClick={reserve} disabled={unavailable}>{expired ? "Expired" : soldOut ? "Sold out" : "Reserve"}</Button>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container mx-auto px-3 pb-10 sm:px-4">
          <div className="mb-4 flex items-end justify-between gap-3">
            <h2 className="text-xl font-bold sm:text-2xl">More from {data.merchant.business_name}</h2>
            <Link to="/browse" className="shrink-0 text-sm text-primary hover:underline">Browse all →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {related.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
          </div>
        </section>
      )}

      <section className="container mx-auto px-3 pb-10 sm:px-4">
        <AdSlot size="leaderboard" id="ad-space-13-listing-bottom" slotCode="AD SPACE 13" label="AD SPACE 13 listing bottom" />
      </section>
    </SiteLayout>
  );
}

function PriceBox({ data, expired, soldOut, unavailable, reserve }: { data: any; expired: boolean; soldOut: boolean; unavailable: boolean; reserve: () => void }) {
  return (
    <>
      <div className="text-sm text-muted-foreground line-through">{formatBND(Number(data.original_price))}</div>
      <div className="text-4xl font-bold text-primary">{formatBND(Number(data.discounted_price))}</div>
      <div className="mt-2 flex items-center gap-3 text-sm font-medium text-foreground"><Clock className="h-4 w-4" /> Pickup window: {formatTime(data.pickup_start)} – {formatTime(data.pickup_end)}</div>
      <div className="mt-1 text-sm text-muted-foreground">{expired ? "Pickup window has ended" : `${data.quantity_available} left`}</div>
      <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">Collection is only allowed during the allocated pickup window.</p>
      <Button className="mt-5 w-full rounded-full" size="lg" onClick={reserve} disabled={unavailable}>{expired ? "Offer expired" : soldOut ? "Sold out" : "Reserve now"}</Button>
      <p className="mt-3 text-xs text-muted-foreground">Merchant details are shown after reservation is confirmed.</p>
    </>
  );
}

function formatTime(timeValue: string) {
  if (!timeValue) return "";
  if (timeValue.length <= 5) return timeValue;
  try {
    return new Date(timeValue).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return timeValue;
  }
}

function toCardData(listing: SampleListing): ListingCardData {
  return {
    id: listing.id,
    title: listing.title,
    image_url: listing.image_url,
    category: listing.category,
    original_price: listing.original_price,
    discounted_price: listing.discounted_price,
    quantity_available: listing.quantity_available,
    pickup_start: listing.pickup_start,
    pickup_end: listing.pickup_end,
    created_at: listing.created_at,
    produced_at: getProducedAt(listing),
    merchant: {
      business_name: listing.merchant.business_name,
      district: listing.merchant.district,
      rating: listing.merchant.rating,
      image_url: listing.merchant.image_url,
    },
  };
}
