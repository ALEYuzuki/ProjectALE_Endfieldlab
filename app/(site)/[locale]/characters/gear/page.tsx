import { DocSection } from "../../_doc";

export default async function Page({ params }:{ params: Promise<{locale:string}> }) {
  const { locale } = await params;
  return DocSection({
    locale,
    titleJa: "装備・アクセサリー",
    jaType: "characters_gear_ja",
    enType: "characters_gear_en"
  });
}