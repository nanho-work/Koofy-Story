import Link from "next/link";
import { notFound } from "next/navigation";
import { WorkGrid } from "../../../../components/WorkGrid";
import { genreOf } from "../../../../lib/discovery";
import { genreLabel, genres, isGenre, sectionHref, siteCopy, type Genre } from "../../../../lib/navigation";
import { copy } from "../../../../lib/languages";
import { listWorks, requireLanguage } from "../../../../lib/story";

type Props = { params: Promise<{ language: string; genre: string }> };

export async function generateMetadata({ params }: Props) {
  const { language, genre } = await params;
  const locale = requireLanguage(language);
  if (genre === "all") return { title: copy[locale].works };
  return isGenre(genre) ? { title: genreLabel(locale, genre) } : {};
}

export default async function BrowsePage({ params }: Props) {
  const { language, genre } = await params;
  if (genre !== "all" && !isGenre(genre)) notFound();
  const locale = requireLanguage(language);
  const t = siteCopy[locale];
  const allWorks = await listWorks(locale);
  const available = new Set(allWorks.map(genreOf));
  const filters = [...new Set<Genre>([...genres, ...available])]
    .filter((entry) => available.has(entry) || entry === genre);
  const works = genre === "all" ? allWorks : allWorks.filter((work) => genreOf(work) === genre);
  return <main className="browse">
    <h1 className="visually-hidden">{genre === "all" ? copy[locale].works : genreLabel(locale, genre)}</h1>
    <nav className="browse-genres" aria-label={t.genreNav}>
      {(["all", ...filters] as const).map((entry) => (
        <Link key={entry} href={sectionHref(locale, entry)} prefetch={false}
          aria-current={entry === genre ? "page" : undefined}>
          {entry === "all" ? t.all : genreLabel(locale, entry)}
        </Link>
      ))}
    </nav>
    {works.length > 0 && <p className="browse-count">{t.numberOfWorks(works.length)}</p>}
    <WorkGrid works={works} language={locale} />
  </main>;
}
