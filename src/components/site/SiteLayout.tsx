import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileBottomNav } from "./MobileBottomNav";
import { Toaster } from "@/components/ui/sonner";
import { AdSlot } from "@/components/ads/AdSlot";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden pb-16 md:pb-0">
      <Header />
      <main className="flex-1">{children}</main>
      <div className="container mx-auto px-3 py-6 sm:px-4 sm:py-8">
        <AdSlot size="leaderboard" id="ad-space-99-footer-global" slotCode="AD SPACE 99" label="AD SPACE 99 global footer sponsor space" />
      </div>
      <Footer />
      <MobileBottomNav />
      <Toaster richColors position="top-center" />
    </div>
  );
}