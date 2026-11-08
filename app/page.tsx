import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { isLanguage } from "../lib/languages";
import { browserLanguage, languageCookie, sectionHref } from "../lib/navigation";

export default async function Home() {
  const [jar, requestHeaders] = await Promise.all([cookies(), headers()]);
  const saved = jar.get(languageCookie)?.value;
  const language = saved && isLanguage(saved) ? saved : browserLanguage(requestHeaders.get("accept-language"));
  redirect(sectionHref(language));
}
