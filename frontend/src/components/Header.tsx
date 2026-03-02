"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useTranslation } from "react-i18next";
import AuthButton from "./AuthButton";

export default function Header() {
  const itemCount = useCartStore((s) => s.itemCount);
  const { t, i18n } = useTranslation("common");

  const toggleLanguage = () => {
    const next = i18n.language.startsWith("ko") ? "en" : "ko";
    i18n.changeLanguage(next);
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2 sm:gap-4">
        <Link href="/" className="font-semibold text-base sm:text-lg shrink-0">
          {t("siteTitle")}
        </Link>
        <nav className="flex items-center flex-wrap justify-end gap-2 sm:gap-4 text-sm sm:text-base">
          <Link href="/products">{t("nav.products")}</Link>
          <Link href="/admin">{t("nav.admin")}</Link>
          <Link href="/cart" className="flex items-center gap-1">
            <ShoppingCart className="w-5 h-5" />
            <span>{t("nav.cart")}</span>
            {itemCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <AuthButton />
          <button
            type="button"
            onClick={toggleLanguage}
            className="text-xs border rounded px-2 py-1 hover:bg-accent shrink-0"
          >
            {i18n.language.startsWith("ko") ? "EN" : "KO"}
          </button>
        </nav>
      </div>
    </header>
  );
}
