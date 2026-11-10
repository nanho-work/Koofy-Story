import { isLanguage, type Language } from "./languages";

export const genres = ["novels", "fairy-tales", "poetry", "essays", "interviews", "other", "monthly"] as const;
export type Genre = (typeof genres)[number] | `category-${string}`;
export const languageCookie = "koofy_story_language";

export function isGenre(value: string): value is Genre {
  return genres.some((genre) => genre === value) || /^category-.+$/u.test(value);
}

export function sectionHref(language: Language, genre?: Genre | "all") {
  return genre ? `/${language}/browse/${encodeURIComponent(genre)}` : `/${language}`;
}

export function genreLabel(language: Language, genre: Genre) {
  const known = genres.find((entry) => entry === genre);
  return known ? siteCopy[language][known] : genre.slice("category-".length);
}

export function browserLanguage(header: string | null): Language {
  const preferences = (header ?? "").split(",").map((entry) => {
    const [tag, ...params] = entry.trim().toLowerCase().split(";");
    const quality = params.find((param) => param.trim().startsWith("q="));
    return { language: tag.trim().split("-")[0], quality: quality ? Number(quality.trim().slice(2)) : 1 };
  });
  const preferred = preferences.sort((a, b) => b.quality - a.quality)
    .find(({ language, quality }) => quality > 0 && quality <= 1 && isLanguage(language))?.language;
  return preferred && isLanguage(preferred) ? preferred : "en";
}

export const siteCopy = {
  ko: {
    home: "홈", novels: "소설", "fairy-tales": "동화", poetry: "시", essays: "에세이",
    interviews: "사람을 만나다", other: "기타", monthly: "월간 쿠피",
    all: "전체", genreNav: "장르", seeAll: "전체 보기",
    nav: "주 메뉴", language: "언어", featured: "추천 작품", latest: "새로 올라온 글",
    older: "이전 작품", newer: "다음 작품", slide: (i: number) => `${i}번째 작품`,
    pauseSlides: "자동 넘김 일시정지", playSlides: "자동 넘김 재생",
    explore: "작품 둘러보기", readStory: "이 글 읽기", upcoming: "공개 예정",
    newestFirst: "최신순", firstEpisodeFirst: "첫 화부터", episodeOrder: "회차 정렬",
    start: "첫 화 읽기", details: "작품 보기", episodeList: "회차 목록",
    empty: "아직 공개된 글이 없어요.", moreSoon: "새 글이 공개되면 이곳에서 만날 수 있어요.",
    numberOfWorks: (n: number) => `${n}개 작품`,
  },
  en: {
    home: "Home", novels: "Fiction", "fairy-tales": "Fairy Tales", poetry: "Poetry", essays: "Essays",
    interviews: "Interviews", other: "Other", monthly: "Koofy Monthly",
    all: "All", genreNav: "Genres", seeAll: "View all",
    nav: "Main navigation", language: "Language", featured: "Featured stories", latest: "New on Koofy",
    older: "Previous story", newer: "Next story", slide: (i: number) => `Story ${i}`,
    pauseSlides: "Pause automatic slides", playSlides: "Play automatic slides",
    explore: "Explore stories", readStory: "Read this story", upcoming: "Coming soon",
    newestFirst: "Newest first", firstEpisodeFirst: "Oldest first", episodeOrder: "Episode order",
    start: "Read from the start", details: "View story", episodeList: "All episodes",
    empty: "No stories here yet.", moreSoon: "New releases will appear here.",
    numberOfWorks: (n: number) => `${n} ${n === 1 ? "story" : "stories"}`,
  },
  ja: {
    home: "ホーム", novels: "小説", "fairy-tales": "童話", poetry: "詩", essays: "エッセイ",
    interviews: "インタビュー", other: "その他", monthly: "月刊クーフィー",
    all: "すべて", genreNav: "ジャンル", seeAll: "すべて見る",
    nav: "メインメニュー", language: "言語", featured: "おすすめの作品", latest: "新着の読みもの",
    older: "前の作品", newer: "次の作品", slide: (i: number) => `${i}番目の作品`,
    pauseSlides: "自動切り替えを一時停止", playSlides: "自動切り替えを再生",
    explore: "作品を探す", readStory: "この記事を読む", upcoming: "公開予定",
    newestFirst: "新着順", firstEpisodeFirst: "第1話から", episodeOrder: "エピソードの並び順",
    start: "第1話から読む", details: "作品を見る", episodeList: "エピソード一覧",
    empty: "公開中の作品はまだありません。", moreSoon: "新しい作品が公開されると、ここに表示されます。",
    numberOfWorks: (n: number) => `${n}作品`,
  },
};
