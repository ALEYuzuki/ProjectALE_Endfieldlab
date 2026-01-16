import { DocSection } from "../_content";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return DocSection({
    locale,
    titleJa: "",
    jaType: "",
    enType: "",
  });
}