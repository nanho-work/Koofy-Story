import type { ReactNode } from "react";
import { StoryHeader } from "../../components/StoryHeader";
import { copy } from "../../lib/languages";
import { requireLanguage } from "../../lib/story";

export async function generateMetadata({ params }: { params: Promise<{ language: string }> }) {
  const language = requireLanguage((await params).language);
  const t = copy[language];
  return { title: { default: t.brand, template: `%s | ${t.brand}` }, description: t.intro };
}

export default async function StoryLayout({ children, params }: {
  children: ReactNode;
  params: Promise<{ language: string }>;
}) {
  const language = requireLanguage((await params).language);
  return (
    <div className="story-shell" lang={language}>
      <StoryHeader language={language} />
      <div className="page">{children}</div>
      <footer className="site-footer"><div>© KoofyLab</div></footer>
    </div>
  );
}
