import { defineType, defineField } from "sanity";
import { timestamps, ogFields, slugField } from "./_shared";

/** 同型ドキュメント（title/slug/body + timestamps + og）を量産 */
export function makeDoc(name: string, title: string) {
  return defineType({
    name,
    title,
    type: "document",
    fields: [
      defineField({ name: "title", title: "Title", type: "string", validation: r => r.required() }),
      slugField(),
      defineField({ name: "body", title: "Body", type: "array", of: [{ type: "block" }, { type: "image" }] }),
      ...timestamps,
      ...ogFields
    ],
    orderings: [{ name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] }]
  });
}