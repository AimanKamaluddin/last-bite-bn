import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Toaster } from "@/components/ui/sonner";
import { AdSlot } from "@/components/ads/AdSlot";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <div className="container mx-auto px-4 py-8">
        <AdSlot size="leaderboard" id="footer-leaderboard" label="Footer ad" />
      </div>
      <Footer />
      <Toaster richColors position="top-center" />
    </div>
  );
}
