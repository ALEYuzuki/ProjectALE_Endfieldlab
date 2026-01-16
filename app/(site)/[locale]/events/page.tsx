import { sanityClient } from "@/lib/sanity";
import { qListByType } from "@/lib/sanity.queries";
import { ZListItem } from "@/lib/zod";
import PageHeader from "@/components/PageHeader";
import ItemCard from "@/components/ItemCard";
import { z } from "zod";

type Params = Promise<{ locale: "ja" | "en" }>;

// ✅ Zod schema から TS 型を生成（これが正解）
type ListItem = z.infer<typeof ZListItem>;

export default async function IndexPage({ params }: { params: Params }) {
  const { locale } = await params;

  const base = (key: string) => (locale === "ja" ? `${key}_ja` : `${key}_en`);
  const type = base("events");

  const raw = await sanityClient.fetch(qListByType, { type });

  // ✅ parse結果は ListItem[] に確定する
  const parsed = ZListItem.array().safeParse(raw);
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
          {list.map((it) => (
            <ItemCard
              key={it._id}
              title={it.title}
              date={it._createdAt}
              excerpt={it.excerpt}
              href={it.slug ? `/${locale}/events/${encodeURIComponent(it.slug)}` : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}
