import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Languages, Menu, ShoppingBasket, User as UserIcon, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { LASTBITE_LOGO } from "@/assets/lastbite-logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { isAuthenticated, isMerchant, isAdmin, signOut, user } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const username = user?.user_metadata?.username || user?.user_metadata?.display_name || user?.user_metadata?.name || user?.email?.split("@")[0];
  const navGroupClass = "grid gap-1 rounded-[1.35rem] border border-border/70 bg-muted/45 p-1 shadow-sm md:flex md:items-center md:rounded-full md:bg-white/65 md:backdrop-blur";
  const primaryNavGroupClass = "grid gap-1 rounded-[1.35rem] border border-primary/15 bg-primary/8 p-1 shadow-sm md:flex md:items-center md:rounded-full md:bg-primary/8 md:backdrop-blur";
  const navLinkClass = "rounded-2xl px-4 py-3 text-base font-bold text-muted-foreground transition hover:bg-background hover:text-primary hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 md:rounded-full md:px-4 md:py-2 md:text-sm";
  const activeNavClass = "bg-background text-primary shadow-sm ring-1 ring-border/70";

  const nav = (
    <>
      <div className={navGroupClass}>
        <Link to="/about" className={navLinkClass} activeProps={{ className: activeNavClass }} onClick={() => setOpen(false)}>
          {t("about")}
        </Link>
        <Link to="/user-guide" className={navLinkClass} activeProps={{ className: activeNavClass }} onClick={() => setOpen(false)}>
          User Guide
        </Link>
      </div>
      <div className={primaryNavGroupClass}>
        <Link to="/browse" className={navLinkClass} activeProps={{ className: activeNavClass }} onClick={() => setOpen(false)}>
          {t("browseFood")}
        </Link>
        <Link to="/merchant/onboarding" className={navLinkClass} activeProps={{ className: activeNavClass }} onClick={() => setOpen(false)}>
          {t("forBusinesses")}
        </Link>
      </div>
    </>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-14 items-center justify-between gap-2 px-3 sm:h-16 sm:px-4">
        <Link to="/" className="flex min-w-0 items-center" onClick={() => setOpen(false)} aria-label="LastBite home">
          <img src={LASTBITE_LOGO} alt="LastBite" className="h-12 w-auto object-contain sm:h-14" />
        </Link>

        <nav className="hidden items-center gap-2 md:flex">{nav}</nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 rounded-full px-3"
            onClick={toggleLanguage}
            aria-label={`${t("language")}: ${language === "en" ? t("english") : t("malay")}`}
          >
            <Languages className="h-4 w-4" />
            <span>{language === "en" ? "BM" : "EN"}</span>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="relative h-9 rounded-full border-primary/30 bg-primary/10 px-3 text-primary shadow-sm hover:bg-primary hover:text-primary-foreground"
          >
            <Link to={isAuthenticated ? "/dashboard" : "/auth"} aria-label={t("myOrders")} onClick={() => setOpen(false)}>
              <ShoppingBasket className="h-4 w-4" />
              <span className="ml-1.5 hidden font-bold sm:inline">{t("myOrders")}</span>
            </Link>
          </Button>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2 rounded-full px-3">
                  <UserIcon className="h-4 w-4" />
                  <span className="hidden max-w-28 truncate sm:inline">@{username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1">
                <DropdownMenuItem onClick={() => navigate({ to: "/dashboard" })}>
                  {t("myOrders")}
                </DropdownMenuItem>
                {isMerchant && (
                  <DropdownMenuItem onClick={() => navigate({ to: "/merchant" })}>
                    {t("merchantDashboard")}
                  </DropdownMenuItem>
                )}
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate({ to: "/admin" })}>
                    {t("adminPanel")}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await signOut();
                    navigate({ to: "/" });
                  }}
                >
                  {t("signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden h-9 sm:inline-flex">
                <Link to="/auth">{t("signIn")}</Link>
              </Button>
              <Button asChild size="sm" className="hidden h-9 rounded-full sm:inline-flex">
                <Link to="/browse">{t("browseFood")}</Link>
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={t("toggleMenu")}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {open && (
        <div className="container mx-auto border-t px-3 py-3 md:hidden">
          {isAuthenticated && <div className="mb-3 rounded-2xl bg-muted px-4 py-3 text-sm font-semibold">Signed in as @{username}</div>}
          <nav className="grid gap-3">{nav}</nav>
          {isAuthenticated ? (
            <div className="mt-3 grid gap-2 border-t pt-3">
              <Button asChild variant="outline" className="h-11 justify-start rounded-2xl" onClick={() => setOpen(false)}><Link to="/dashboard">{t("myOrders")}</Link></Button>
              {isMerchant && <Button asChild variant="outline" className="h-11 justify-start rounded-2xl" onClick={() => setOpen(false)}><Link to="/merchant">{t("merchantDashboard")}</Link></Button>}
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-2 border-t pt-3">
              <Button asChild variant="outline" className="h-11 rounded-full" onClick={() => setOpen(false)}>
                <Link to="/auth">{t("signIn")}</Link>
              </Button>
              <Button asChild className="h-11 rounded-full" onClick={() => setOpen(false)}>
                <Link to="/browse">{t("browseFood")}</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
