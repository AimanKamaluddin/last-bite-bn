import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t bg-cream/60">
      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Leaf className="h-4 w-4" />
            </span>
            <span className="font-bold">Last Bite</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Save good food. Pay less. Reduce waste — proudly built for Brunei
            Darussalam.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/browse" className="hover:text-foreground">Browse food</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About us</Link></li>
            <li><Link to="/merchant/onboarding" className="hover:text-foreground">Join as merchant</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/legal/terms" className="hover:text-foreground">Terms & Conditions</Link></li>
            <li><Link to="/legal/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link to="/legal/food-safety" className="hover:text-foreground">Food Safety Disclaimer</Link></li>
            <li><Link to="/legal/merchant-agreement" className="hover:text-foreground">Merchant Agreement</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>hello@lastbite.bn</li>
            <li>Bandar Seri Begawan, BN</li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Last Bite — All rights reserved.
      </div>
    </footer>
  );
}
