import Link from "next/link";
import { notFound } from "next/navigation";
import { ProtectedProse } from "../../../../../../components/ProtectedProse";
import { siteCopy } from "../../../../../../lib/navigation";
import { copy } from "../../../../../../lib/languages";
import { coverUrl, episodeHref, getEpisode, requireLanguage, workHref } from "../../../../../../lib/story";

type Props = { params: Promise<{ language: string; workId: string; episodeId: string }> };

export async function generateMetadata({ params }: Props) {
  const { language, workId, episodeId } = await params;
  const result = await getEpisode(requireLanguage(language), workId, episodeId);
  return result ? { title: result.episode.title, description: result.episode.description || undefined } : {};
}

export default async function EpisodePage({ params }: Props) {
  const { language: value, workId, episodeId } = await params;
  const language = requireLanguage(value);
  const t = copy[language];
  const result = await getEpisode(language, workId, episodeId);
  if (!result) notFound();
  const { work, episode, blocks, previous, next } = result;

  return (
    <main className="reader">
      <Link className="back-link" href={workHref(language, work.id)}>← {work.title}</Link>
      <article>
        <header className="reader-heading">
          {episode.number !== null && <p className="eyebrow">{t.number(episode.number)}</p>}
          <h1>{episode.title}</h1>
          {episode.author && <p className="muted">{episode.author}</p>}
        </header>
        {episode.cover && <img className="reader-cover" alt="" src={coverUrl(language, work.id, episode.id)} decoding="async" />}
        <ProtectedProse>
          {blocks.map((block, index) => block.type === "heading"
            ? <h2 key={index}>{block.text}</h2>
            : <p key={index}>{block.text}</p>)}
        </ProtectedProse>
      </article>
      {work.kind === "series" && <nav className="reader-nav" aria-label={t.episodes}>
        {previous && <Link rel="prev" href={episodeHref(language, work.id, previous.id)}>← {t.previous}</Link>}
        <Link href={workHref(language, work.id)}>{siteCopy[language].episodeList}</Link>
        {next && <Link rel="next" href={episodeHref(language, work.id, next.id)}>{t.next} →</Link>}
      </nav>}
    </main>
  );
}
