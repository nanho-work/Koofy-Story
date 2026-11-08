import type { ReactNode } from "react";
import { StoryHeader } from "../../components/StoryHeader";
import { requireLanguage } from "../../lib/story";

export default async function StoryLayout({ children, params }: {
  children: ReactNode;
  params: Promise<{ language: string }>;
}) {
  const language = requireLanguage((await params).language);
  return (
    <div className="page" lang={language}>
      <StoryHeader language={language} />
      {children}
    </div>
  );
}
