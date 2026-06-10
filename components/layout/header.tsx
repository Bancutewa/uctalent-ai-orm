"use client";

import Link from "next/link";
import { MessageSquareShare, Languages } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export function Header() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center px-4 md:px-8 mx-auto max-w-7xl">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-105">
            <MessageSquareShare className="h-5 w-5" />
          </div>
          <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/80 transition-all duration-300">
            UCTalent AI-ORM
          </span>
        </Link>
        
        <nav className="ml-auto flex items-center gap-5 text-sm font-medium">
          <Link 
            href="/" 
            className="relative text-foreground transition-colors hover:text-primary py-1.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
          >
            {t("header.reviews")}
          </Link>
          <Link 
            href="/settings" 
            className="relative text-muted-foreground transition-colors hover:text-primary py-1.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
          >
            {t("header.settings")}
          </Link>

          <div className="pl-3 border-l border-border/40 flex items-center">
            <button
              onClick={() => setLocale(locale === "vi" ? "en" : "vi")}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] tracking-wide font-bold bg-muted/65 hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-300 border border-border/40 shadow-xs"
              title={locale === "vi" ? "Switch to English" : "Chuyển sang tiếng Việt"}
            >
              <Languages className="h-3 w-3" />
              <span>{locale === "vi" ? "EN" : "VI"}</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
