import { DocSection } from "../../_doc";

export default async function Page({ params }:{ params: Promise<{locale:string}> }) {
  const { locale } = await params;
  return DocSection({
    locale,
    titleJa: "おすすめ編成",
    jaType: "characters_builds_ja",
    enType: "characters_builds_en"
  });
}