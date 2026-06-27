import { AlertTriangle, BellRing, CheckCircle2, Clock, PackageCheck, XCircle } from "lucide-react";

type Audience = "buyer" | "seller";

const content = {
  buyer: {
    reserved: {
      icon: BellRing,
      title: "Reservation confirmed",
      body: "Your order has been sent to the seller. Keep your pickup code ready.",
      className: "border-primary/30 bg-primary/10 text-primary",
    },
    ready: {
      icon: PackageCheck,
      title: "Your order is ready",
      body: "Head to the seller and show your pickup code.",
      className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
    },
    collected: {
      icon: CheckCircle2,
      title: "Order picked up",
      body: "This order has been marked as collected.",
      className: "border-muted bg-muted/60 text-foreground",
    },
    cancelled: {
      icon: XCircle,
      title: "Order cancelled",
      body: "This reservation has been cancelled and cannot be picked up.",
      className: "border-destructive/30 bg-destructive/10 text-destructive",
    },
  },
  seller: {
    reserved: {
      icon: BellRing,
      title: "New booked order",
      body: "A buyer reserved this item. Prepare it for the selected pickup time.",
      className: "border-primary/30 bg-primary/10 text-primary",
    },
    ready: {
      icon: Clock,
      title: "Waiting for pickup",
      body: "You marked this order ready. Wait for the buyer to show the pickup code.",
      className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
    },
    collected: {
      icon: CheckCircle2,
      title: "Order completed",
      body: "This order has been picked up and marked as collected.",
      className: "border-muted bg-muted/60 text-foreground",
    },
    cancelled: {
      icon: AlertTriangle,
      title: "Order cancelled",
      body: "This reservation has been cancelled.",
      className: "border-destructive/30 bg-destructive/10 text-destructive",
    },
  },
} as const;

export function OrderStatusNotice({ status, audience }: { status?: string | null; audience: Audience }) {
  const safeStatus = status === "ready" || status === "collected" || status === "cancelled" ? status : "reserved";
  const item = content[audience][safeStatus];
  const Icon = item.icon;

  return (
    <div className={`rounded-2xl border px-4 py-3 ${item.className}`}>
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <div className="text-sm font-bold">{item.title}</div>
          <div className="mt-0.5 text-xs opacity-85">{item.body}</div>
        </div>
      </div>
    </div>
  );
}
