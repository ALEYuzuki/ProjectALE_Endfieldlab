import { DocSection } from "../../_doc";

export default async function Page({ params }:{ params: Promise<{locale:string}> }) {
  const { locale } = await params;
  return DocSection({
    locale,
    titleJa: "ボス",
    jaType: "enemies_boss_ja",
    enType: "enemies_boss_en"
  });
}