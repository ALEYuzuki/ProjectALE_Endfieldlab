import { DocSection } from "../../_content";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return DocSection({
    locale,
    titleJa: "Cookieポリシー",
    titleEn: "Cookie Policy",
    jaType: "policy_cookie_ja",
    enType: "policy_cookie_en",
  });
}