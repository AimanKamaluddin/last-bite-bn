import { Clock, ShieldCheck } from "lucide-react";
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
  const windowText = hasWindow ? `${formatTime12Hour(pickupStart)} – ${formatTime12Hour(pickupEnd)}` : "your pickup window";

  if (compact) {
    return (
      <div className={cn("inline-flex max-w-full items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-3 py-2 text-xs font-bold text-primary shadow-sm backdrop-blur", className)}>
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10">
          <Clock className="h-3.5 w-3.5" />
        </span>
        <span className="truncate">Pickup only during {windowText}</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-[1.75rem] border border-primary/10 bg-gradient-to-br from-white via-primary/5 to-accent/10 p-4 shadow-sm ring-1 ring-white/70 sm:p-5", className)}>
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-accent/20 blur-2xl" />
      <div className="relative flex items-start gap-3 sm:gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <Clock className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-black leading-tight text-foreground sm:text-base">Pickup Window</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-black text-primary">
              <ShieldCheck className="h-3.5 w-3.5" /> Food quality notice
            </span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Please collect your order only during the scheduled pickup time. Merchants may not be able to prepare or hand over food outside this window.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/85 px-3 py-1.5 text-xs font-black text-primary shadow-sm">
            <Clock className="h-3.5 w-3.5" />
            {windowText}
          </div>
        </div>
      </div>
    </div>
  );
}
