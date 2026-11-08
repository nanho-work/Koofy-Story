import Link from "next/link";
import { notFound } from "next/navigation";
import { StoryCover } from "../../../../components/StoryCover";
import { WorkLabel } from "../../../../components/WorkLabel";
import { genreOf } from "../../../../lib/discovery";
import { sectionHref, siteCopy } from "../../../../lib/navigation";
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
  const { work, episodes, upcomingEpisodes = [] } = result;
  const genre = genreOf(work);
  const site = siteCopy[language];
  const day = new Intl.DateTimeFormat(language, { dateStyle: "medium", timeZone: "Asia/Seoul" });
  const dateTime = new Intl.DateTimeFormat(language, { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Seoul" });
  const rows = [
    ...episodes.map((episode) => ({ episode, scheduledAt: undefined })),
    ...upcomingEpisodes.map((episode) => ({ episode, scheduledAt: episode.scheduledAt })),
  ].sort((a, b) => (a.episode.number ?? 0) - (b.episode.number ?? 0));

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
      {work.kind === "series" && <section aria-labelledby="episode-heading">
        <h2 id="episode-heading" className="section-heading">{t.episodes} <small>{t.count(work.episodeCount)}</small></h2>
        <ol className="episode-list">
          {rows.map(({ episode, scheduledAt }) => {
            const heading = <>
              {episode.number !== null && <span className="eyebrow">{t.number(episode.number)}</span>}
              <span className={episode.number === null ? "episode-title-only" : undefined}>{episode.title}</span>
            </>;
            const hasTime = scheduledAt?.includes("T");
            return <li key={episode.id}>
              {scheduledAt ? <div className="episode-row episode-row--upcoming">
                {heading}
                <span className="episode-schedule">
                  {site.upcoming}
                  <time dateTime={scheduledAt}>{(hasTime ? dateTime : day).format(new Date(scheduledAt))}{hasTime && " KST"}</time>
                </span>
              </div> : <Link className="episode-row" href={episodeHref(language, work.id, episode.id)}>
                {heading}
                <span className="episode-arrow" aria-hidden="true">→</span>
              </Link>}
            </li>;
          })}
        </ol>
      </section>}
    </main>
  );
}
