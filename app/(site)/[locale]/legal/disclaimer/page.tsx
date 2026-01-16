import { DocSection } from "../../_content";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return DocSection({
    locale,
    titleJa: "免責事項",
    titleEn: "Disclaimer",
    jaType: "policy_disclaimer_ja",
    enType: "policy_disclaimer_en",
  });
}