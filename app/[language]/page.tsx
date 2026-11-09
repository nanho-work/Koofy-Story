import Link from "next/link";
import { FeaturedCarousel } from "../../components/FeaturedCarousel";
import { StoryCover } from "../../components/StoryCover";
import { DiscoveryEmpty, WorkGrid } from "../../components/WorkGrid";
import { discover, genreOf } from "../../lib/discovery";
import { copy } from "../../lib/languages";
import { genreLabel, homeHref, isGenre, sectionHref, siteCopy } from "../../lib/navigation";
import { coverUrl, episodeHref, requireLanguage, workHref } from "../../lib/story";

export default async function HomePage({ params, searchParams }: {
  params: Promise<{ language: string }>;
  searchParams: Promise<{ genre?: string | string[] }>;
}) {
  const language = requireLanguage((await params).language);
  const t = siteCopy[language];
  const reading = copy[language];
  const { genre } = await searchParams;
  const { availableGenres, selectedGenre, featured, latest, shelf } =
    await discover(language, typeof genre === "string" && isGenre(genre) ? genre : undefined);
  const dates = new Intl.DateTimeFormat(language, { month: "short", day: "numeric", timeZone: "Asia/Seoul" });
  return (
    <main className="home">
      <h1 className="visually-hidden">{reading.brand}</h1>
      <nav className="home-genres" aria-label={t.genreNav}>
        {[undefined, ...availableGenres].map((entry) => (
          <Link key={entry ?? "featured"} href={homeHref(language, entry)} prefetch={false}
            aria-current={entry === selectedGenre ? "page" : undefined} scroll={false}>
            {entry ? genreLabel(language, entry) : t.recommended}
          </Link>
        ))}
      </nav>
      <FeaturedCarousel key={selectedGenre ?? "featured"} language={language} slides={featured.map(({ work, first, monthlyEpisode }) => {
        const genre = genreOf(work);
        const episode = monthlyEpisode ?? first;
        return {
          id: work.id,
          title: monthlyEpisode?.title ?? work.title,
          label: monthlyEpisode ? work.title : genreLabel(language, genre),
          image: monthlyEpisode?.cover ? coverUrl(language, work.id, monthlyEpisode.id) : work.cover ? coverUrl(language, work.id) : undefined,
          href: workHref(language, work.id),
          readHref: episode ? episodeHref(language, work.id, episode.id) : undefined,
          readLabel: monthlyEpisode ? t.readStory : work.kind === "series" ? t.start : reading.read,
        };
      })} />
      <section className="new-releases" aria-labelledby="new-releases-heading">
        <div className="home-section-heading">
          <h2 id="new-releases-heading">{t.latest}</h2>
          {selectedGenre && <Link href={sectionHref(language, selectedGenre)}>{t.seeAll}</Link>}
        </div>
        {latest.length ? <ul className="release-grid">
          {latest.map(({ work, episode }) => {
            const genre = genreOf(work);
            return <li key={episode.id}>
              <Link className="release-item" href={episodeHref(language, work.id, episode.id)}>
                <StoryCover url={episode.cover ? coverUrl(language, work.id, episode.id) : work.cover ? coverUrl(language, work.id) : undefined} />
                <div className="release-copy">
                  <p className="release-meta">
                    <span>{genreLabel(language, genre)}</span>
                    {Number.isFinite(Date.parse(episode.releasedAt)) && <time dateTime={episode.releasedAt}>{dates.format(new Date(episode.releasedAt))}</time>}
                  </p>
                  <h3>{episode.title}</h3>
                  {work.kind === "series" && <p className="release-work">{work.title}{episode.number !== null ? ` · ${reading.number(episode.number)}` : ""}</p>}
                </div>
                <span className="release-arrow" aria-hidden="true">→</span>
              </Link>
            </li>;
          })}
        </ul> : <DiscoveryEmpty language={language} />}
      </section>
      {!!shelf.length && <section className="home-shelf" aria-labelledby="home-shelf-heading">
        <h2 id="home-shelf-heading">{t.explore}</h2>
        <WorkGrid works={shelf} language={language} variant="shelf" />
      </section>}
    </main>
  );
}
