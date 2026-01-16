import { DocSection } from "../../_doc";

import { getDocByType } from "../../_content";
export default async function Page({ params }:{ params: Promise<{locale:string}> }) {
  const { locale } = await params;
  return DocSection({
    locale,
    titleJa: "蟆丞梛",
    jaType: "enemies_small_ja",
    enType: "enemies_small_en"
  });
}