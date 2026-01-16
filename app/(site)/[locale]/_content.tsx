import { groq } from "next-sanity";
import { sanityClient } from "@/lib/sanityClient";
import RichText from "@/components/RichText";

/** Sanity: get first doc by _type */
export async function getDocByType(type: string) {
  const query = groq`*[_type == $type][0]{ _id, title, description, content, body }`;
  return sanityClient.fetch(query, { type });
}

/** Optional variant used by _doc.tsx */
export async function getOptionalDocByType(type: string) {
  try {
    const doc = await getDocByType(type);
    return doc ?? null;
  } catch {
    return null;
  }
}

/**
 * Common section renderer for simple policy/guide pages
 */
export async function DocSection(args: {
  locale: string;
  titleJa: string;
  titleEn?: string;
  jaType: string;
  enType: string;
}) {
  const base = (args.locale || "ja").split("-")[0];
  const type = base === "ja" ? args.jaType : args.enType;
  const doc: any = await getDocByType(type);

  const title =
    doc?.title ??
    (base === "ja" ? args.titleJa : args.titleEn ?? args.titleJa);
  const desc: string | null = doc?.description ?? null;
  const pt = doc?.content ?? doc?.body ?? null;

  return (
    <article className="space-y-6">
      <header className="border-b border-neutral-800 pb-3">
        <h1 className="text-xl font-bold">{title}</h1>
        {desc ? <p className="text-sm text-neutral-400 mt-1">{desc}</p> : null}
      </header>
      {pt ? (
        <RichText value={pt} />
      ) : (
        <p className="text-sm text-neutral-500 italic">
          {base === "ja"
            ? "Sanity側で本文を入力してください。"
            : "Please add content in Sanity."}
        </p>
      )}
    </article>
  );
}