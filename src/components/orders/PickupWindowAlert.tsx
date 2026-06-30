import { Clock } from "lucide-react";
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
      <div className={cn("inline-flex max-w-full items-center gap-2 rounded-full border border-primary/15 bg-white/90 px-3 py-2 text-xs font-black text-primary shadow-md shadow-primary/5 backdrop-blur", className)}>
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-sm">
          <Clock className="h-3.5 w-3.5" />
        </span>
        <span className="truncate">Pickup only during {windowText}</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-[2rem] border border-primary/10 bg-[radial-gradient(circle_at_10%_10%,hsl(var(--accent)/0.18),transparent_30%),linear-gradient(135deg,white,hsl(var(--primary)/0.06),hsl(var(--accent)/0.08))] p-4 shadow-lg shadow-primary/5 ring-1 ring-white/80 sm:p-5", className)}>
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/25 blur-3xl" />
      <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative flex items-start gap-3 sm:gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-xl shadow-primary/20">
          <Clock className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-black leading-tight text-foreground sm:text-lg">Pickup Window</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Please collect your order only during the scheduled pickup time. Merchants may not be able to prepare or hand over food outside this window.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-black text-primary-foreground shadow-sm">
            <Clock className="h-3.5 w-3.5" />
            {windowText}
          </div>
        </div>
      </div>
    </div>
  );
}
