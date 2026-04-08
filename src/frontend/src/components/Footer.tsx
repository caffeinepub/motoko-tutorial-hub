import { Heart } from "lucide-react";
import React from "react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const link = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="border-t border-border mt-24 py-8">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-foreground">Motoko Mastery</span>
          <span>— Learn the Internet Computer's native language</span>
        </div>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          © {year}. Built with{" "}
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" /> using
          caffeine.ai
        </a>
      </div>
    </footer>
  );
}
