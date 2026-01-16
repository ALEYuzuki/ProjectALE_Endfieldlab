import { DocSection } from "../_content";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return DocSection({
    locale,
    titleJa: "武器（概要）",
    jaType: "weapons_overview_ja",
    enType: "weapons_overview_en",
  });
}