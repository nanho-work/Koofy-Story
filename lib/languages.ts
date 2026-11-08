export const languages = ["ko", "en", "ja"] as const;
export type Language = (typeof languages)[number];

export function isLanguage(value: string): value is Language {
  return languages.some((language) => language === value);
}

export const languageNames: Record<Language, string> = { ko: "한국어", en: "English", ja: "日本語" };

export const copy = {
  ko: {
    brand: "쿠피 스토리", intro: "월간 쿠피, 연재소설, 그리고 사람들의 이야기.",
    works: "작품 목록", empty: "아직 공개된 작품이 없어요.",
    unavailable: "작품을 불러오지 못했어요. 잠시 후 다시 열어 주세요.",
    monthly: "월간 쿠피", series: "연재", book: "한 권으로 읽기", ongoing: "연재 중", completed: "완결",
    read: "읽기", episodes: "회차 목록", previous: "이전 회차", next: "다음 회차",
    count: (value: number) => `${value}개 회차`,
    number: (value: number) => value === 0 ? "프롤로그" : `${value}화`,
  },
  en: {
    brand: "Koofy Story", intro: "Koofy Monthly, serial fiction, and stories about people.",
    works: "Works", empty: "No works have been published yet.",
    unavailable: "We couldn't load the stories. Please try again in a moment.",
    monthly: "Koofy Monthly", series: "Series", book: "Standalone", ongoing: "Ongoing", completed: "Complete",
    read: "Read", episodes: "Episodes", previous: "Previous episode", next: "Next episode",
    count: (value: number) => `${value} ${value === 1 ? "episode" : "episodes"}`,
    number: (value: number) => value === 0 ? "Prologue" : `Episode ${value}`,
  },
  ja: {
    brand: "クーフィーストーリー", intro: "月刊クーフィー、連載小説、人をめぐる物語。",
    works: "作品一覧", empty: "公開中の作品はまだありません。",
    unavailable: "作品を読み込めませんでした。しばらくしてからもう一度お試しください。",
    monthly: "月刊クーフィー", series: "連載", book: "読み切り", ongoing: "連載中", completed: "完結",
    read: "読む", episodes: "エピソード一覧", previous: "前のエピソード", next: "次のエピソード",
    count: (value: number) => `全${value}話`,
    number: (value: number) => value === 0 ? "プロローグ" : `第${value}話`,
  },
};
