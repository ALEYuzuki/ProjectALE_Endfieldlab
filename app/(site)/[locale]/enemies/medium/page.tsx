import { DocSection } from "../../_doc";

export default async function Page({ params }:{ params: Promise<{locale:string}> }) {
  const { locale } = await params;
  return DocSection({
    locale,
    titleJa: "中型",
    jaType: "enemies_medium_ja",
    enType: "enemies_medium_en"
  });
}