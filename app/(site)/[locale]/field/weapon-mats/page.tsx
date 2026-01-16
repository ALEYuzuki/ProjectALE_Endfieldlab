import { DocSection } from "../../_doc";

export default async function Page({ params }:{ params: Promise<{locale:string}> }) {
  const { locale } = await params;
  return DocSection({
    locale,
    titleJa: "強化素材（武器）",
    jaType: "field_weapon_mats_ja",
    enType: "field_weapon_mats_en"
  });
}