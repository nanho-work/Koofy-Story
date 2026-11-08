import type { Language } from "../lib/languages";
import { StorySidebarDrawer } from "./StorySidebarDrawer";

const stores = [
  {
    id: "app-store",
    extension: "svg",
    url: "https://apps.apple.com/app/id6814514729",
    label: { ko: "App Store에서 다운로드", en: "Download on the App Store", ja: "App Storeからダウンロード" },
  },
  {
    id: "google-play",
    extension: "png",
    url: "https://play.google.com/store/apps/details?id=com.koofylab.koofyreader",
    label: { ko: "Google Play에서 다운로드", en: "Get it on Google Play", ja: "Google Playで手に入れよう" },
  },
];

const labels = {
  ko: {
    title: "쿠피리더", description: "휴대폰과 태블릿에서도 편하게 읽어보세요.",
    downloads: "앱 다운로드", trigger: "앱", close: "닫기",
  },
  en: {
    title: "Koofy Reader", description: "Read comfortably on your phone or tablet.",
    downloads: "Download the app", trigger: "App", close: "Close",
  },
  ja: {
    title: "クーフィーリーダー", description: "スマートフォンやタブレットでも快適に読めます。",
    downloads: "アプリをダウンロード", trigger: "アプリ", close: "閉じる",
  },
};

function AppDownloads({ language }: { language: Language }) {
  const t = labels[language];
  return <div className="sidebar-downloads">
    <p className="sidebar-kicker">{t.downloads}</p>
    <h2>{t.title}</h2>
    <p className="sidebar-description">{t.description}</p>
    <ul className="sidebar-stores">
      {stores.map(({ id, extension, url, label }) => (
        <li key={id}>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <img
              className={`store-badge store-badge--${id}`}
              src={`/store-badges/${id}-${language}.${extension}`}
              alt={label[language]}
              lang={language}
            />
          </a>
        </li>
      ))}
    </ul>
  </div>;
}

export function StorySidebar({ language }: { language: Language }) {
  return <aside className="story-sidebar" aria-label={labels[language].downloads}>
    <AppDownloads language={language} />
  </aside>;
}

export function StoryMobileSidebar({ language }: { language: Language }) {
  const t = labels[language];
  return <StorySidebarDrawer label={t.downloads} trigger={t.trigger} closeLabel={t.close}>
    <AppDownloads language={language} />
  </StorySidebarDrawer>;
}
