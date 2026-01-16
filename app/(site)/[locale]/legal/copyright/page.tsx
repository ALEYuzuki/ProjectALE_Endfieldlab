import { DocSection } from "../../_content";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return DocSection({
    locale,
    titleJa: "著作権・通報（DMCA等）",
    titleEn: "Copyright & Reports (DMCA etc.)",
    jaType: "policy_copyright_ja",
    enType: "policy_copyright_en",
  });
}