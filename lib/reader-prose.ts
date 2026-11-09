import { copy, type Language } from "./languages";
import type { Episode } from "./story";

type Block = { type: "heading" | "paragraph"; text: string };

export function readingBlocks(blocks: Block[], episode: Pick<Episode, "number" | "title">, language: Language): Block[] {
  const [first, ...rest] = blocks;
  if (!first) return blocks;

  const normalize = (text: string) => text.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase(language);
  const title = normalize(episode.title);
  if (!title) return blocks;

  const [firstLine, ...remainingLines] = first.text.trim().split(/\r?\n/);
  const opening = normalize(first.type === "heading" ? first.text : firstLine);
  const prefixes = episode.number === null ? [] : [copy[language].number(episode.number)];
  if (language === "en" && episode.number !== null) prefixes.push(`Chapter ${episode.number}`);
  const repeated = opening === title || prefixes.map(normalize).some((prefix) => {
    const tail = opening.slice(prefix.length);
    return opening.startsWith(prefix) && /^[\s.:·—–-]/.test(tail) && tail.replace(/^[\s.:·—–-]+/, "") === title;
  });
  if (!repeated) return blocks;

  const remaining = first.type === "paragraph" ? remainingLines.join("\n").trim() : "";
  if (remaining) return [{ ...first, text: remaining }, ...rest];
  return rest.length ? rest : blocks;
}
