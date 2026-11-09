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

export function WorkGrid({ works, language, variant }: { works: Work[]; language: Language; variant?: "shelf" }) {
  if (!works.length) return <DiscoveryEmpty language={language} />;
  return (
    <ul className="work-grid" data-variant={variant}>
      {works.map((work) => <li key={work.id}>
        <Link className="work-card" href={workHref(language, work.id)}>
          <StoryCover url={work.cover ? coverUrl(language, work.id) : undefined} />
          <div className="work-card-copy">
            <h3>{work.title}</h3>
            {variant !== "shelf" && <>
              <WorkLabel work={work} language={language} />
              {work.description.trim() && <p className="work-card-description">{work.description}</p>}
            </>}
          </div>
        </Link>
      </li>)}
    </ul>
  );
}
