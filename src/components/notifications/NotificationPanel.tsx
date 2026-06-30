import { Link } from "@tanstack/react-router";
import { Bell, CheckCircle2, Clock, PackageCheck, ReceiptText, RefreshCcw, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const getPickupTime = (order: any) => order.pickup_time || String(order.payment_method ?? "").match(/pickup_time=([^|]+)/)?.[1] || "";

const formatDateTime = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

const isPickupSoon = (order: any) => {
  const pickupStart = order.listings?.pickup_start;
  if (!pickupStart || !["reserved", "ready"].includes(order.status)) return false;
  const start = new Date(pickupStart).getTime();
  if (Number.isNaN(start)) return false;
  const now = Date.now();
  return start > now && start - now <= 2 * 60 * 60 * 1000;
};

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  tone: "default" | "success" | "warning" | "destructive";
  icon: any;
  href?: string;
  createdAt?: string;
};

function sortByNewest(items: NotificationItem[]) {
  return [...items].sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
}

export function CustomerNotifications({ orders }: { orders: any[] }) {
  const items = sortByNewest(
    orders.flatMap((order): NotificationItem[] => {
      const listingTitle = order.listings?.title ?? "your order";
      const merchantName = order.merchants?.business_name ?? "the merchant";
      const pickupTime = getPickupTime(order);
      const notifications: NotificationItem[] = [];

      if (order.status === "reserved") {
        notifications.push({
          id: `${order.id}-confirmed`,
          title: "Order confirmed",
          body: `Your reservation for ${listingTitle} is confirmed. Collect from ${merchantName}${pickupTime ? ` at ${pickupTime}` : " during the pickup window"}.`,
          tone: "success",
          icon: CheckCircle2,
          href: `/order/${order.id}`,
          createdAt: order.created_at,
        });
      }

      if (isPickupSoon(order)) {
        notifications.push({
          id: `${order.id}-pickup-reminder`,
          title: "Pickup reminder",
          body: `${listingTitle} is due for pickup soon${pickupTime ? ` at ${pickupTime}` : ""}. Please bring your pickup code: ${order.pickup_code}.`,
          tone: "warning",
          icon: Clock,
          href: `/order/${order.id}`,
          createdAt: order.listings?.pickup_start ?? order.created_at,
        });
      }

      if (order.status === "ready") {
        notifications.push({
          id: `${order.id}-ready`,
          title: "Order ready",
          body: `${merchantName} has marked ${listingTitle} as ready for pickup. Show code ${order.pickup_code} when collecting.`,
          tone: "success",
          icon: PackageCheck,
          href: `/order/${order.id}`,
          createdAt: order.updated_at ?? order.created_at,
        });
      }

      if (order.status === "cancelled") {
        notifications.push({
          id: `${order.id}-cancelled`,
          title: "Order cancelled",
          body: `Your reservation for ${listingTitle} has been cancelled.`,
          tone: "destructive",
          icon: XCircle,
          href: `/order/${order.id}`,
          createdAt: order.updated_at ?? order.created_at,
        });
      }

      if (order.payment_status === "refunded") {
        notifications.push({
          id: `${order.id}-refunded`,
          title: "Refund issued",
          body: `A refund has been issued for ${listingTitle}.`,
          tone: "default",
          icon: RefreshCcw,
          href: `/order/${order.id}`,
          createdAt: order.updated_at ?? order.created_at,
        });
      }

      return notifications;
    }),
  );

  return <NotificationList title="Customer notifications" empty="No customer notifications yet." items={items} />;
}

export function MerchantNotifications({ orders }: { orders: any[] }) {
  const items = sortByNewest(
    orders.flatMap((order): NotificationItem[] => {
      const listingTitle = order.listings?.title ?? "an item";
      const pickupTime = getPickupTime(order);
      const notifications: NotificationItem[] = [];

      if (order.status === "reserved") {
        notifications.push({
          id: `${order.id}-new-order`,
          title: "New reservation",
          body: `A customer reserved ${order.quantity} × ${listingTitle}${pickupTime ? ` for ${pickupTime}` : ""}. Pickup code: ${order.pickup_code}.`,
          tone: "success",
          icon: ReceiptText,
          createdAt: order.created_at,
        });
      }

      if (isPickupSoon(order)) {
        notifications.push({
          id: `${order.id}-merchant-pickup-soon`,
          title: "Pickup soon",
          body: `Prepare ${listingTitle}. Customer pickup code is ${order.pickup_code}${pickupTime ? ` and selected time is ${pickupTime}` : ""}.`,
          tone: "warning",
          icon: Clock,
          createdAt: order.listings?.pickup_start ?? order.created_at,
        });
      }

      if (order.status === "cancelled") {
        notifications.push({
          id: `${order.id}-merchant-cancelled`,
          title: "Reservation cancelled",
          body: `Reservation ${order.pickup_code} for ${listingTitle} has been cancelled.`,
          tone: "destructive",
          icon: XCircle,
          createdAt: order.updated_at ?? order.created_at,
        });
      }

      if (order.payment_status === "refunded") {
        notifications.push({
          id: `${order.id}-merchant-refunded`,
          title: "Refund recorded",
          body: `A refund was recorded for order ${order.pickup_code}.`,
          tone: "default",
          icon: RefreshCcw,
          createdAt: order.updated_at ?? order.created_at,
        });
      }

      return notifications;
    }),
  );

  return <NotificationList title="Merchant notifications" empty="No merchant notifications yet." items={items} />;
}

function NotificationList({ title, empty, items }: { title: string; empty: string; items: NotificationItem[] }) {
  if (!items.length) {
    return <Card className="rounded-3xl p-8 text-center text-muted-foreground">{empty}</Card>;
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Badge variant="secondary" className="rounded-full">{items.length}</Badge>
      </div>
      {items.map((item) => {
        const Icon = item.icon ?? Bell;
        const content = (
          <Card className="rounded-3xl p-4 transition hover:shadow-md">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold">{item.title}</h3>
                  <ToneBadge tone={item.tone} />
                </div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.body}</p>
                {item.createdAt && <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(item.createdAt)}</p>}
              </div>
              {item.href && <Button asChild size="sm" variant="outline" className="rounded-full"><Link to={item.href as any}>View</Link></Button>}
            </div>
          </Card>
        );
        return <div key={item.id}>{content}</div>;
      })}
    </div>
  );
}

function ToneBadge({ tone }: { tone: NotificationItem["tone"] }) {
  if (tone === "success") return <Badge className="rounded-full">New</Badge>;
  if (tone === "warning") return <Badge variant="secondary" className="rounded-full">Reminder</Badge>;
  if (tone === "destructive") return <Badge variant="destructive" className="rounded-full">Important</Badge>;
  return <Badge variant="outline" className="rounded-full">Update</Badge>;
}
