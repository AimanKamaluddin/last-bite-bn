import { Link } from "@tanstack/react-router";
import { Home, Search, ShoppingBag, Store } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function MobileBottomNav() {
  const { isAuthenticated, isMerchant } = useAuth();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 px-2 pb-[max(0.45rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-12px_30px_-22px_hsl(var(--foreground))] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        <NavItem to="/" icon={Home} label="Home" />
        <NavItem to="/browse" icon={Search} label="Browse" />
        <NavItem to={isAuthenticated ? "/dashboard" : "/auth"} icon={ShoppingBag} label="Orders" />
        <NavItem to={isMerchant ? "/merchant" : "/merchant/onboarding"} icon={Store} label="Vendor" />
      </div>
    </nav>
  );
}

function NavItem({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <Link to={to as any} className="flex min-h-12 flex-col items-center justify-center rounded-2xl px-2 py-1 text-[11px] font-semibold text-muted-foreground transition hover:bg-muted hover:text-primary [&.active]:bg-primary/10 [&.active]:text-primary">
      <Icon className="mb-0.5 h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
}
