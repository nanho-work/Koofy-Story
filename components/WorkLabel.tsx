import { copy, type Language } from "../lib/languages";
import type { Work } from "../lib/story";

export function WorkLabel({ work, language }: { work: Work; language: Language }) {
  const t = copy[language];
  return <p className="eyebrow">
    {work.issueMonth
      ? [t.monthly, work.status && t[work.status]].filter(Boolean).join(" · ")
      : work.status ? t[work.status] : work.kind === "series" ? t.series : t.book}
  </p>;
}
