import { sanityClient } from "@/lib/sanity";
import { qListByType } from "@/lib/sanity.queries";
import { ZListItem } from "@/lib/zod";
import PageHeader from "@/components/PageHeader";
import ItemCard from "@/components/ItemCard";

type Params = Promise<{ locale: "ja" | "en" }>;

// ✅ Zodから「1件の型」を取り出して、listの型を確定させる
type ListItem = ZListItem["_type"];

export default async function IndexPage({ params }: { params: Params }) {
  const { locale } = await params;
  const base = (key: string) => (locale === "ja" ? `${key}_ja` : `${key}_en`);
  const type = base("events");

  const raw = await sanityClient.fetch(qListByType, { type });
  const parsed = ZListItem.array().safeParse(raw);

  // ✅ 失敗時の [] でも型が ListItem[] になるように明示
  const list: ListItem[] = parsed.success ? parsed.data : [];

  return (
    <section className="space-y-4">
      <PageHeader
        title={locale === "ja" ? "イベント" : "Events"}
        hint={locale === "ja" ? "最新順 50件まで" : "Up to 50 recent items"}
      />

      {list.length === 0 ? (
        <p className="text-sm text-neutral-400">
          {locale === "ja" ? "まだコンテンツがありません。" : "No content yet."}
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {list.map((it: ListItem) => (
            <ItemCard
              key={it._id}
              title={it.title}
              date={it._createdAt}
              excerpt={it.excerpt}
              href={
                it.slug
                  ? `/${locale}/events/${encodeURIComponent(it.slug)}`
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
