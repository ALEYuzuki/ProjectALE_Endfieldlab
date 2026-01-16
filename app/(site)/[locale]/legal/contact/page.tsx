import { DocSection } from "../../_content";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return DocSection({
    locale,
    titleJa: "お問い合わせ",
    titleEn: "Contact",
    jaType: "policy_contact_ja",
    enType: "policy_contact_en",
  });
}