import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-12 border-t bg-cream/60 sm:mt-20">
      <div className="container mx-auto grid gap-8 px-3 py-8 sm:px-4 sm:py-12 md:grid-cols-4 md:gap-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Leaf className="h-4 w-4" />
            </span>
            <span className="font-bold">Last Bite</span>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {t("saveGoodFood")}
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">{t("explore")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/browse" className="inline-block py-1 hover:text-foreground">{t("browseFoodLower")}</Link></li>
            <li><Link to="/about" className="inline-block py-1 hover:text-foreground">{t("aboutUs")}</Link></li>
            <li><Link to="/merchant/onboarding" className="inline-block py-1 hover:text-foreground">{t("joinAsMerchant")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">{t("legal")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/legal/terms" className="inline-block py-1 hover:text-foreground">{t("terms")}</Link></li>
            <li><Link to="/legal/privacy" className="inline-block py-1 hover:text-foreground">{t("privacy")}</Link></li>
            <li><Link to="/legal/food-safety" className="inline-block py-1 hover:text-foreground">{t("foodSafety")}</Link></li>
            <li><Link to="/legal/merchant-agreement" className="inline-block py-1 hover:text-foreground">{t("merchantAgreement")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">{t("contact")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="break-all"><a href="mailto:lastbite.bn@gmail.com" className="hover:text-foreground">lastbite.bn@gmail.com</a></li>
            <li>Bandar Seri Begawan, BN</li>
          </ul>
        </div>
      </div>
      <div className="border-t px-3 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Last Bite — {t("allRightsReserved")}
      </div>
    </footer>
  );
}
