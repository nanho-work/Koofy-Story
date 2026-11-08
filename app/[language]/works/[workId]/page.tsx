import Link from "next/link";
import { notFound } from "next/navigation";
import { StoryCover } from "../../../../components/StoryCover";
import { WorkLabel } from "../../../../components/WorkLabel";
import { copy } from "../../../../lib/languages";
import { coverUrl, episodeHref, getWork, requireLanguage } from "../../../../lib/story";

type Props = { params: Promise<{ language: string; workId: string }> };

export async function generateMetadata({ params }: Props) {
  const { language, workId } = await params;
  const result = await getWork(requireLanguage(language), workId);
  return result ? { title: result.work.title, description: result.work.description || undefined } : {};
}

export default async function WorkPage({ params }: Props) {
  const { language: value, workId } = await params;
  const language = requireLanguage(value);
  const t = copy[language];
  const result = await getWork(language, workId);
  if (!result) notFound();
  const { work, episodes } = result;

  return (
    <main className="detail">
      <Link className="back-link" href={`/${language}`}>← {t.works}</Link>
      <div className="work-intro">
        <StoryCover url={work.cover ? coverUrl(language, work.id) : undefined} />
        <div>
          <WorkLabel work={work} language={language} />
          <h1>{work.title}</h1>
          {work.author && <p className="muted">{work.author}</p>}
          {work.description && <p className="description">{work.description}</p>}
          {work.kind === "book" && <Link className="read-button" href={episodeHref(language, work.id, episodes[0].id)}>{t.read}</Link>}
        </div>
      </div>
      {work.kind === "series" && <section aria-labelledby="episode-heading">
        <h2 id="episode-heading" className="section-heading">{t.episodes} <small>{t.count(work.episodeCount)}</small></h2>
        <ol className="episode-list">
          {episodes.map((episode) => (
            <li key={episode.id}>
              <Link href={episodeHref(language, work.id, episode.id)}>
                {episode.number !== null && <span className="eyebrow">{t.number(episode.number)}</span>}
                <span>{episode.title}</span>
                <span className="episode-arrow" aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>}
    </main>
  );
}
