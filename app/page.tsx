import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isLanguage } from "../lib/languages";

export default async function Home() {
  const preferred = (await headers()).get("accept-language")?.split(",")
    .map((value) => value.trim().toLowerCase().split(/[-;]/, 1)[0])
    .find(isLanguage);
  redirect(`/${preferred ?? "ko"}`);
}
