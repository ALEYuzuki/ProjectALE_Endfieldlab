import { DocSection } from "../../_doc";

export default async function Page({ params }:{ params: Promise<{locale:string}> }) {
  const { locale } = await params;
  return DocSection({
    locale,
    titleJa: "農業",
    jaType: "base_agriculture_ja",
    enType: "base_agriculture_en"
  });
}