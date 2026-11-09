import { genres, type Genre } from "./navigation";
import type { Language } from "./languages";
import { getWork, listWorks, type Episode, type Work } from "./story";

const categories = {
  novels: new Set(["소설", "웹소설", "일반 소설", "연재 소설", "판타지", "로맨스", "fiction", "novel", "web novel", "web fiction", "小説", "ウェブ小説"]),
  "fairy-tales": new Set(["동화", "고전동화", "고전 동화", "명작동화", "명작 동화", "fairy tale", "fairy tales", "童話", "昔話"]),
  poetry: new Set(["시", "시집", "poetry", "詩"]),
  essays: new Set(["에세이", "수필", "essay", "essays", "エッセイ", "随筆"]),
  interviews: new Set(["사람을 만나다", "인터뷰", "interview", "interviews", "インタビュー"]),
  other: new Set(["기타", "other", "その他"]),
};

export function genreOf(work: Work): Genre {
  const category = work.category.normalize("NFKC").trim().replace(/\s+/g, " ");
  const value = category.toLowerCase();
  if (work.issueMonth || ["월간 쿠피", "월간쿠피", "koofy monthly", "月刊クーフィー"].includes(value)) return "monthly";
  const known = (Object.keys(categories) as (keyof typeof categories)[])
    .find((genre) => categories[genre].has(value));
  return known ?? (category ? `category-${category}` : "other");
}

function time(item: { releasedAt: string }) {
  return Date.parse(item.releasedAt) || 0;
}

function newestEpisode(episodes: Episode[]) {
  return episodes.reduce<Episode | undefined>((newest, item) =>
    !newest || time(item) > time(newest) || (time(item) === time(newest) && (item.number ?? 0) > (newest.number ?? 0))
      ? item : newest, undefined);
}

export async function discover(language: Language, requestedGenre?: Genre) {
  const all = await listWorks(language);
  const available = new Set(all.map(genreOf));
  const availableGenres = [...new Set<Genre>([...genres, ...available])]
    .filter((genre) => genre !== "monthly" && available.has(genre));
  const selectedGenre = requestedGenre && availableGenres.includes(requestedGenre) ? requestedGenre : undefined;
  const works = all.filter((work) => !selectedGenre || genreOf(work) === selectedGenre)
    .sort((a, b) => time(b) - time(a));
  const illustrated = works.filter((work) => work.cover);
  const monthly = selectedGenre ? undefined : works.find((work) => genreOf(work) === "monthly");
  const featured = [...new Set([...(monthly ? [monthly] : []), ...illustrated, ...works])].slice(0, 3);
  const recent = works.slice(0, 4);
  const candidates = [...new Set([...featured, ...recent])];
  const details = await Promise.allSettled(candidates.map(({ id }) => getWork(language, id)));
  const byId = new Map(candidates.map(({ id }, index) => [id, details[index]]));
  const episodesOf = (work: Work) => {
    const result = byId.get(work.id);
    return result?.status === "fulfilled" ? result.value?.episodes ?? [] : [];
  };
  const latest = recent.flatMap((work) => {
    const episode = newestEpisode(episodesOf(work));
    return episode ? [{ work, episode }] : [];
  }).sort((a, b) => time(b.episode) - time(a.episode));
  if (works.length && !latest.length && details.some((result) => result.status === "rejected")) {
    throw new Error("Could not load recent episodes");
  }
  return {
    availableGenres,
    selectedGenre,
    featured: featured.map((work) => ({
      work,
      monthlyEpisode: work === monthly ? newestEpisode(episodesOf(work)) : undefined,
      first: episodesOf(work)[0],
    })),
    latest,
    shelf: [...new Set([...illustrated, ...works])].slice(0, 4),
  };
}
