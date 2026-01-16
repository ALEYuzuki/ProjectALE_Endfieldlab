import { DocSection } from "../../_content";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return DocSection({
    locale,
    titleJa: "バフ／デバフ効果",
    jaType: "research_buffs_ja",
    enType: "research_buffs_en"
  });
}