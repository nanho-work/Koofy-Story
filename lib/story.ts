import { cache } from "react";
import { notFound } from "next/navigation";
import { isLanguage, type Language } from "./languages";

const endpoint = process.env.READER_STORY_URL ||
  "https://asia-northeast3-koofy-reader.cloudfunctions.net/readerStory";

type StoryItem = {
  id: string;
  title: string;
  description: string;
  author: string;
  cover: boolean;
  releasedAt: string;
};

export type Work = StoryItem & {
  kind: "book" | "series";
  issueMonth: string;
  category: string;
  status: "ongoing" | "completed" | null;
  episodeCount: number;
};

export type Episode = StoryItem & { number: number | null };
type WorkResult = { work: Work; episodes: Episode[] };
type ReadingResult = {
  work: Work;
  episode: Episode;
  blocks: { type: "heading" | "paragraph"; text: string }[];
  previous: Episode | null;
  next: Episode | null;
};

export function requireLanguage(value: string): Language {
  if (!isLanguage(value)) notFound();
  return value;
}

export function workHref(language: Language, id: string) {
  return `/${language}/works/${id}`;
}

export function episodeHref(language: Language, workId: string, episodeId: string) {
  return `${workHref(language, workId)}/read/${episodeId}`;
}

function storyUrl(action: string, language: Language, work?: string, episode?: string) {
  const url = new URL(endpoint);
  url.searchParams.set("action", action);
  url.searchParams.set("language", language);
  if (work) url.searchParams.set("work", work);
  if (episode) url.searchParams.set("episode", episode);
  return url;
}

export function coverUrl(language: Language, workId: string, episodeId?: string) {
  return storyUrl("cover", language, workId, episodeId).href;
}

async function read<T>(action: string, language: Language, work?: string, episode?: string): Promise<T | null> {
  if ([work, episode].some((id) => id !== undefined && !/^[a-f0-9]{32}$/.test(id))) return null;
  const response = await fetch(storyUrl(action, language, work, episode), {
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  if (response.status === 404 && response.headers.get("content-type")?.includes("application/json")) return null;
  if (!response.ok) throw new Error(`Story API returned ${response.status}`);
  return response.json() as Promise<T>;
}

export const listWorks = cache(async (language: Language) =>
  (await read<{ works: Work[] }>("list", language))?.works ?? []);

export const getWork = cache(async (language: Language, work: string) =>
  read<WorkResult>("work", language, work));

export const getEpisode = cache(async (language: Language, work: string, episode: string) =>
  read<ReadingResult>("episode", language, work, episode));
