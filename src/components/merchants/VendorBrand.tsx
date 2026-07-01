import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Store } from "lucide-react";

export type VendorBrandData = {
  id?: string | null;
  business_name?: string | null;
  business_type?: string | null;
  district?: string | null;
  rating?: number | null;
  image_url?: string | null;
};

type VendorBrandProps = {
  merchant?: VendorBrandData | null;
  variant?: "card" | "inline" | "compact";
  showProfileLink?: boolean;
  className?: string;
};

const getInitial = (name: string) => name.trim().charAt(0).toUpperCase() || "L";

function VendorLogo({ merchant, size = "md" }: { merchant?: VendorBrandData | null; size?: "sm" | "md" | "lg" }) {
  const name = merchant?.business_name || "Vendor";
  const sizeClass = size === "lg" ? "h-16 w-16 text-lg" : size === "sm" ? "h-9 w-9 text-xs" : "h-12 w-12 text-sm";

  return (
    <div className={`relative grid shrink-0 place-items-center overflow-hidden rounded-2xl border bg-primary/10 font-black text-primary shadow-sm ring-1 ring-border ${sizeClass}`} aria-hidden="true">
      <span>{getInitial(name)}</span>
      {merchant?.image_url ? <img src={merchant.image_url} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : <Store className="h-1/2 w-1/2" />}
    </div>
  );
}

function VendorProfileLink({ merchant }: { merchant?: VendorBrandData | null }) {
  if (!merchant?.id) return null;
  return <Link to="/merchant-profile/$id" params={{ id: merchant.id }} className="text-xs font-bold text-primary hover:underline">View vendor</Link>;
}

export function VendorBrand({ merchant, variant = "inline", showProfileLink = true, className = "" }: VendorBrandProps) {
  const name = merchant?.business_name || "Vendor";
  const rating = typeof merchant?.rating === "number" ? merchant.rating : Number(merchant?.rating ?? 0);

  if (variant === "compact") {
    return (
      <div className={`flex min-w-0 items-center gap-2 ${className}`}>
        <VendorLogo merchant={merchant} size="sm" />
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">From</div>
          <div className="truncate text-sm font-black leading-tight text-foreground">{name}</div>
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={`rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4 shadow-sm ${className}`}>
        <div className="flex items-center gap-3">
          <VendorLogo merchant={merchant} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold uppercase tracking-wide text-primary">From this vendor</div>
            <div className="truncate text-xl font-black leading-tight">{name}</div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {merchant?.business_type && <Badge variant="secondary" className="rounded-full text-[10px]">{merchant.business_type}</Badge>}
              {merchant?.district && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{merchant.district}</span>}
              {Number.isFinite(rating) && rating > 0 && <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-sun text-sun" />{rating.toFixed(1)}</span>}
            </div>
            {showProfileLink && <div className="mt-2"><VendorProfileLink merchant={merchant} /></div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-w-0 items-center gap-2.5 rounded-2xl bg-primary/5 p-2 ring-1 ring-primary/10 ${className}`}>
      <VendorLogo merchant={merchant} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold uppercase tracking-wide text-primary">From</div>
        <div className="truncate text-sm font-black leading-tight text-foreground">{name}</div>
        <div className="mt-0.5 flex min-w-0 items-center gap-2 text-[11px] text-muted-foreground">
          {merchant?.district && <span className="truncate">{merchant.district}</span>}
          {Number.isFinite(rating) && rating > 0 && <span className="inline-flex shrink-0 items-center gap-1"><Star className="h-3 w-3 fill-sun text-sun" />{rating.toFixed(1)}</span>}
        </div>
      </div>
      {showProfileLink && <VendorProfileLink merchant={merchant} />}
    </div>
  );
}
