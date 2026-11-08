import Link from "next/link";
import { coverUrl, type Work, workHref } from "../lib/story";
import { StoryCover } from "./StoryCover";
import { WorkLabel } from "./WorkLabel";
import type { Language } from "../lib/languages";
import { siteCopy } from "../lib/navigation";

export function DiscoveryEmpty({ language }: { language: Language }) {
  const t = siteCopy[language];
  return <div className="discovery-empty"><p>{t.empty}</p><p>{t.moreSoon}</p></div>;
}

export function WorkGrid({ works, language }: { works: Work[]; language: Language }) {
  if (!works.length) return <DiscoveryEmpty language={language} />;
  return (
    <ul className="work-grid">
      {works.map((work) => <li key={work.id}>
        <Link className="work-card" href={workHref(language, work.id)}>
          <StoryCover url={work.cover ? coverUrl(language, work.id) : undefined} />
          <h3>{work.title}</h3>
          <WorkLabel work={work} language={language} />
        </Link>
      </li>)}
    </ul>
  );
}
