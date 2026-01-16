import { DocSection } from "../../_doc";

export default async function Page({ params }:{ params: Promise<{locale:string}> }) {
  const { locale } = await params;
  return DocSection({
    locale,
    titleJa: "その他",
    jaType: "field_misc_ja",
    enType: "field_misc_en"
  });
}