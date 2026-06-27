import { AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTime12Hour } from "@/lib/time";

export function PickupWindowAlert({
  pickupStart,
  pickupEnd,
  compact,
  className,
}: {
  pickupStart?: string | null;
  pickupEnd?: string | null;
  compact?: boolean;
  className?: string;
}) {
  const hasWindow = Boolean(pickupStart && pickupEnd);
  const windowText = hasWindow ? `${formatTime12Hour(pickupStart)} – ${formatTime12Hour(pickupEnd)}` : "the allocated pickup window";

  return (
    <div className={cn("rounded-2xl border border-amber-500/30 bg-amber-50 px-4 py-3 text-amber-950 shadow-sm", className)}>
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-500/15 text-amber-700">
          {compact ? <Clock className="h-4 w-4" /> : <AlertTriangle className="h-5 w-5" />}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-black leading-tight">Pickup only during the pickup window</div>
          <p className="mt-1 text-xs leading-relaxed text-amber-900/85">
            Please collect your order only during <strong>{windowText}</strong>. Merchants may not be able to prepare or hand over food before or after this time.
          </p>
        </div>
      </div>
    </div>
  );
}
