import { DocSection } from "../../_content";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return DocSection({
    locale,
    titleJa: "利用規約",
    titleEn: "Terms of Use",
    jaType: "policy_terms_ja",
    enType: "policy_terms_en",
  });
}