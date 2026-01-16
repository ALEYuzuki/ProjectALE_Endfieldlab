import { DocSection } from "../../_content";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return DocSection({
    locale,
    titleJa: "ダメージ計算式",
    jaType: "research_calc_ja",
    enType: "research_calc_en"
  });
}