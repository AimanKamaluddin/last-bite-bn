import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Leaf, Menu, User as UserIcon, X } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { isAuthenticated, isMerchant, isAdmin, signOut, user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const nav = (
    <>
      <Link to="/about" className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-muted hover:text-primary" onClick={() => setOpen(false)}>
        About
      </Link>
      <Link to="/browse" className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-muted hover:text-primary" onClick={() => setOpen(false)}>
        Browse Food
      </Link>
      <Link to="/merchant/onboarding" className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-muted hover:text-primary" onClick={() => setOpen(false)}>
        For Businesses
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="container mx-auto flex h-14 items-center justify-between gap-2 px-3 sm:h-16 sm:px-4">
        <Link to="/" className="flex min-w-0 items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="truncate text-base font-bold tracking-tight sm:text-lg">Last Bite</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">{nav}</nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2 rounded-full px-3">
                  <UserIcon className="h-4 w-4" />
                  <span className="hidden max-w-28 truncate sm:inline">{user?.email?.split("@")[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate({ to: "/dashboard" })}>
                  My orders
                </DropdownMenuItem>
                {isMerchant && (
                  <DropdownMenuItem onClick={() => navigate({ to: "/merchant" })}>
                    Merchant dashboard
                  </DropdownMenuItem>
                )}
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate({ to: "/admin" })}>
                    Admin panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await signOut();
                    navigate({ to: "/" });
                  }}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden h-9 sm:inline-flex">
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="hidden h-9 rounded-full sm:inline-flex">
                <Link to="/browse">Browse Food</Link>
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {open && (
        <div className="container mx-auto border-t px-3 py-3 md:hidden">
          <nav className="flex flex-col gap-1">{nav}</nav>
          {!isAuthenticated && (
            <div className="mt-3 grid grid-cols-2 gap-2 border-t pt-3">
              <Button asChild variant="outline" className="rounded-full" onClick={() => setOpen(false)}>
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button asChild className="rounded-full" onClick={() => setOpen(false)}>
                <Link to="/browse">Browse Food</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
