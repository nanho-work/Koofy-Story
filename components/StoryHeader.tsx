import Link from "next/link";
import { copy, languages, languageNames, type Language } from "../lib/languages";

export function StoryHeader({ language }: { language: Language }) {
  return (
    <header className="masthead">
      <Link className="wordmark" href={`/${language}`}>{copy[language].brand}</Link>
      <nav className="language-nav" aria-label="Language">
        {languages.map((value) => (
          <Link key={value} href={`/${value}`} lang={value} hrefLang={value} aria-current={language === value ? "true" : undefined}>
            {languageNames[value]}
          </Link>
        ))}
      </nav>
    </header>
  );
}
