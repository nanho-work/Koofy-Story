import Link from "next/link";
import { StoryCover } from "../../components/StoryCover";
import { WorkLabel } from "../../components/WorkLabel";
import { copy } from "../../lib/languages";
import { coverUrl, listWorks, requireLanguage, workHref } from "../../lib/story";

export default async function CatalogPage({ params }: { params: Promise<{ language: string }> }) {
  const language = requireLanguage((await params).language);
  const t = copy[language];
  const works = await listWorks(language);

  return (
    <main>
      <div className="intro">
        <h1>{t.brand}</h1>
        <p className="description">{t.intro}</p>
      </div>
      <section aria-labelledby="works-heading">
        <h2 id="works-heading" className="section-heading">{t.works}</h2>
        {works.length ? (
          <ul className="work-grid">
            {works.map((work) => (
              <li key={work.id}>
                <Link className="work-card" href={workHref(language, work.id)}>
                  <StoryCover url={work.cover ? coverUrl(language, work.id) : undefined} />
                  <WorkLabel work={work} language={language} />
                  <h3>{work.title}</h3>
                  {work.author && <p className="muted">{work.author}</p>}
                </Link>
              </li>
            ))}
          </ul>
        ) : <p className="empty">{t.empty}</p>}
      </section>
    </main>
  );
}
