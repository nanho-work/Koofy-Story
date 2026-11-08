"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { copy, languages, languageNames, type Language } from "../lib/languages";
import { genres, isGenre, languageCookie, sectionHref, siteCopy } from "../lib/navigation";

export function StoryHeader({ language, sidebarControl }: { language: Language; sidebarControl: ReactNode }) {
  const pathname = usePathname();
  const [, , area, item] = pathname.split("/");
  const genre = area === "browse" && item && isGenre(item) ? item : undefined;
  const t = siteCopy[language];
  return (
    <header className="masthead">
      <div className="masthead-inner">
        <div className="masthead-brand">
          {sidebarControl}
          <Link className="wordmark" href={sectionHref(language)} aria-label={`${copy[language].brand} · ${t.home}`}>
            <svg viewBox="0 0 40 40" width="36" height="36" aria-hidden="true">
              <rect width="40" height="40" rx="10" fill="currentColor" />
              <path d="M20 27.8c-3.8-3.1-7.8-3.8-12-3.2v-13c4.8-.7 8.8.3 12 3.6 3.2-3.3 7.2-4.3 12-3.6v13c-4.2-.6-8.2.1-12 3.2Zm0-12.6v12.2" fill="none" stroke="#faf7ed" strokeWidth="1.55" strokeLinejoin="round" />
              <path d="M8 28.1c4.6-.3 8.6.8 12 3 3.4-2.2 7.4-3.3 12-3" fill="none" stroke="#faf7ed" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <span>{copy[language].brand}</span>
          </Link>
        </div>
        <nav className="main-nav" aria-label={t.nav}>
          {([undefined, ...genres] as const).map((entry) => {
            const href = sectionHref(language, entry);
            return <Link key={entry ?? "home"} href={href} aria-current={pathname === href ? "page" : undefined}>{t[entry ?? "home"]}</Link>;
          })}
        </nav>
        <div className="language-control">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" />
          </svg>
          <select aria-label={t.language} value={language} onChange={(event) => {
            const target = languages.find((entry) => entry === event.target.value);
            if (!target) return;
            const secure = window.location.protocol === "https:" ? "; Secure" : "";
            document.cookie = `${languageCookie}=${target}; Max-Age=31536000; Path=/; SameSite=Lax${secure}`;
            window.location.assign(sectionHref(target, genre));
          }}>
            {languages.map((value) => <option key={value} lang={value} value={value}>{languageNames[value]}</option>)}
          </select>
        </div>
      </div>
    </header>
  );
}
