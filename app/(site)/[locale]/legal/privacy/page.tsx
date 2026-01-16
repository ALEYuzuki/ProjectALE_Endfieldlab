// app/(site)/[locale]/legal/privacy/page.tsx
import { DocSection } from "../../_content";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return DocSection({
    locale,
    titleJa: "個人情報ガイドライン",
    titleEn: "Privacy Policy",
    jaType: "policy_privacy_ja",
    enType: "policy_privacy_en",
  });
}
