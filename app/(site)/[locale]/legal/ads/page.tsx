import { DocSection } from "../../_content";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return DocSection({
    locale,
    titleJa: "広告ガイドライン",
    titleEn: "Advertising Guidelines",
    jaType: "policy_ads_ja",
    enType: "policy_ads_en",
  });
}