import Link from "next/link";
import { notFound } from "next/navigation";
import { StoryCover } from "../../../../components/StoryCover";
import { WorkLabel } from "../../../../components/WorkLabel";
import { genreOf } from "../../../../lib/discovery";
import { sectionHref, siteCopy } from "../../../../lib/navigation";
import { copy, type Language } from "../../../../lib/languages";
import { coverUrl, episodeHref, episodeListAnchor, getWork, requireLanguage } from "../../../../lib/story";

type Props = {
  params: Promise<{ language: string; workId: string }>;
  searchParams: Promise<{ order?: string | string[] }>;
};

function EpisodeTitle({ episode, language }: {
  episode: { number: number | null; title: string };
  language: Language;
}) {
  return <>
    {episode.number !== null && <span className="eyebrow">{copy[language].number(episode.number)}</span>}
    <span className={episode.number === null ? "episode-title-only" : undefined}>{episode.title}</span>
  </>;
}

export async function generateMetadata({ params }: Props) {
  const { language, workId } = await params;
  const result = await getWork(requireLanguage(language), workId);
  return result ? { title: result.work.title, description: result.work.description || undefined } : {};
}

export default async function WorkPage({ params, searchParams }: Props) {
  const { language: value, workId } = await params;
  const language = requireLanguage(value);
  const t = copy[language];
  const result = await getWork(language, workId);
  if (!result) notFound();
  const { work, episodes, upcomingEpisodes = [] } = result;
  const genre = genreOf(work);
  const site = siteCopy[language];
  const day = new Intl.DateTimeFormat(language, { dateStyle: "medium", timeZone: "Asia/Seoul" });
  const dateTime = new Intl.DateTimeFormat(language, { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Seoul" });
  const order = (await searchParams).order === "first" ? "first" : "latest";
  const ordered = order === "first" ? episodes : episodes.toReversed();
  const scheduled = upcomingEpisodes.toSorted((a, b) =>
    a.scheduledAt.localeCompare(b.scheduledAt) || (a.number ?? 0) - (b.number ?? 0));

  return (
    <main className="detail">
      <Link className="back-link" href={sectionHref(language, genre)}>← {genre ? site[genre] : site.home}</Link>
      <div className="work-intro">
        <StoryCover url={work.cover ? coverUrl(language, work.id) : undefined} />
        <div>
          <WorkLabel work={work} language={language} />
          <h1>{work.title}</h1>
          {work.author && <p className="muted">{work.author}</p>}
          {work.description && <p className="description">{work.description}</p>}
          {episodes[0] && <Link className="read-button" href={episodeHref(language, work.id, episodes[0].id)}>{work.kind === "book" ? t.read : site.start}</Link>}
        </div>
      </div>
      {work.kind === "series" && <>
        <section aria-labelledby={episodeListAnchor}>
          <div className="episode-toolbar">
            <h2 id={episodeListAnchor} className="section-heading">{t.episodes} <small>{t.count(work.episodeCount)}</small></h2>
            {episodes.length > 1 && <nav className="episode-order" aria-label={site.episodeOrder}>
              <Link href={`?order=latest#${episodeListAnchor}`} aria-current={order === "latest" ? "true" : undefined}>{site.newestFirst}</Link>
              <Link href={`?order=first#${episodeListAnchor}`} aria-current={order === "first" ? "true" : undefined}>{site.firstEpisodeFirst}</Link>
            </nav>}
          </div>
          <ol className="episode-list">
            {ordered.map((episode) => <li key={episode.id}>
              <Link className="episode-row" href={episodeHref(language, work.id, episode.id)}>
                <EpisodeTitle episode={episode} language={language} />
                <span className="episode-arrow" aria-hidden="true">→</span>
              </Link>
            </li>)}
          </ol>
        </section>
        {scheduled.length > 0 && <section className="upcoming-episodes" aria-labelledby="upcoming-heading">
          <h2 id="upcoming-heading" className="section-heading">{site.upcoming} <small>{t.count(scheduled.length)}</small></h2>
          <ol className="episode-list">
            {scheduled.map((episode) => {
              const { scheduledAt } = episode;
              const hasTime = scheduledAt.includes("T");
              return <li key={episode.id}>
                <div className="episode-row episode-row--upcoming">
                  <EpisodeTitle episode={episode} language={language} />
                  <span className="episode-schedule">
                    <time dateTime={scheduledAt}>{(hasTime ? dateTime : day).format(new Date(scheduledAt))}{hasTime && " KST"}</time>
                  </span>
                </div>
              </li>;
            })}
          </ol>
        </section>}
      </>}
    </main>
  );
}
