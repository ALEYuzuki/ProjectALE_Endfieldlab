import { sanityClient } from "@/lib/sanity";
import { qDetailByTypeAndSlug } from "@/lib/sanity.queries";
import { ZDetail } from "@/lib/zod";
import RichText from "@/components/RichText";
import PageHeader from "@/components/PageHeader";

type Params = Promise<{ locale: "ja"|"en"; slug: string }>;

export default async function NewsDetail({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const type = locale === "ja" ? "news_ja" : "news_en";
  const raw = await sanityClient.fetch(qDetailByTypeAndSlug, { type, slug });
  const parsed = ZDetail.safeParse(raw);
  if (!parsed.success) {
    return <section><PageHeader title={locale==="ja" ? "記事が見つかりません" : "Not Found"} /><p className="text-neutral-400 text-sm">Invalid data</p></section>;
  }
  const doc = parsed.data;
  return (
    <section className="space-y-4">
      <PageHeader title={doc.title} />
      <div className="prose">
        <RichText value={doc.body} />
      </div>
    </section>
  );
}