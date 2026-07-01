import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ExternalLink, Info, MapPin, Phone, Store } from "lucide-react";

export type PickupLocation = {
  business_name?: string | null;
  address?: string | null;
  district?: string | null;
  phone?: string | null;
  opening_hours?: string | null;
};

type PickupLocationCardProps = {
  merchant?: PickupLocation | null;
  pickupStart?: string | null;
  pickupEnd?: string | null;
  selectedPickupTime?: string | null;
  compact?: boolean;
};

const hasText = (value?: string | null) => Boolean(value?.trim());

const formatTime = (value?: string | null) => {
  if (!value) return "";
  if (value.length <= 5 && value.includes(":")) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export function PickupLocationCard({ merchant, pickupStart, pickupEnd, selectedPickupTime, compact = false }: PickupLocationCardProps) {
  const merchantName = merchant?.business_name || "Merchant";
  const address = hasText(merchant?.address) ? merchant?.address?.trim() : "Exact pickup address will be confirmed by the merchant.";
  const district = merchant?.district?.trim();
  const mapsQuery = hasText(merchant?.address) ? encodeURIComponent(`${merchantName}, ${merchant?.address}`) : "";
  const pickupWindow = [formatTime(pickupStart), formatTime(pickupEnd)].filter(Boolean).join(" – ");

  return (
    <Card className={`rounded-3xl border-primary/15 bg-gradient-to-br from-primary/5 via-background to-accent/10 ${compact ? "p-4" : "p-5"}`}>
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
          <MapPin className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <h2 className={compact ? "font-semibold" : "text-lg font-bold"}>Pickup location</h2>
          <p className="mt-1 text-sm text-muted-foreground">Collect your order from the vendor during the pickup window.</p>

          <div className="mt-4 grid gap-3 text-sm">
            <div className="flex items-start gap-2">
              <Store className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <div className="font-semibold text-foreground">{merchantName}</div>
                {district && <div className="text-muted-foreground">{district}</div>}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <div className="font-medium text-foreground">{address}</div>
                {mapsQuery && (
                  <Button asChild variant="link" className="h-auto p-0 text-sm font-semibold">
                    <a href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`} target="_blank" rel="noreferrer">
                      Open in maps <ExternalLink className="ml-1 h-3.5 w-3.5" />
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {(pickupWindow || selectedPickupTime || merchant?.opening_hours) && (
              <div className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  {selectedPickupTime && <div className="font-semibold text-foreground">Selected pickup time: {selectedPickupTime}</div>}
                  {pickupWindow && <div className="text-muted-foreground">Pickup window: {pickupWindow}</div>}
                  {merchant?.opening_hours && <div className="text-muted-foreground">Opening hours: {merchant.opening_hours}</div>}
                </div>
              </div>
            )}

            {merchant?.phone && (
              <div className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="text-muted-foreground">{merchant.phone}</div>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-2xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>Please arrive only during your pickup window and show your pickup code to the vendor.</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
