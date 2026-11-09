import { notFound } from "next/navigation";
import { WorkGrid } from "../../../../components/WorkGrid";
import { genreOf } from "../../../../lib/discovery";
import { genreLabel, isGenre, siteCopy } from "../../../../lib/navigation";
import { listWorks, requireLanguage } from "../../../../lib/story";

type Props = { params: Promise<{ language: string; genre: string }> };

export async function generateMetadata({ params }: Props) {
  const { language, genre } = await params;
  const locale = requireLanguage(language);
  return isGenre(genre) ? { title: genreLabel(locale, genre) } : {};
}

export default async function BrowsePage({ params }: Props) {
  const { language, genre } = await params;
  if (!isGenre(genre)) notFound();
  const locale = requireLanguage(language);
  const t = siteCopy[locale];
  const works = (await listWorks(locale)).filter((work) => genreOf(work) === genre);
  return <main className="browse">
    <h1 className="visually-hidden">{genreLabel(locale, genre)}</h1>
    {works.length > 0 && <p className="browse-count">{t.numberOfWorks(works.length)}</p>}
    <WorkGrid works={works} language={locale} />
  </main>;
}
