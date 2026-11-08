"use client";

import { useParams } from "next/navigation";
import { copy, isLanguage } from "../../lib/languages";

export default function StoryError({ reset }: { reset: () => void }) {
  const { language } = useParams<{ language: string }>();
  const value = isLanguage(language) ? language : "ko";
  const retry = { ko: "다시 시도", en: "Try again", ja: "再試行" }[value];

  return (
    <main className="detail">
      <p role="alert" className="description">{copy[value].unavailable}</p>
      <button className="read-button" type="button" onClick={reset}>{retry}</button>
    </main>
  );
}
