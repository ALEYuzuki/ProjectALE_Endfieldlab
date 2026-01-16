import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";
import { timestamps, ogFields } from "./_shared";

export default defineType({
  name: "news_ja",
  title: "ニュース（日本語）",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "title", title: "タイトル", type: "string", validation: Rule => Rule.required() }),
    defineField({ name: "body", title: "本文", type: "array", of: [{ type: "block" }] }),
    ...ogFields,
    ...timestamps
  ],
  orderings: [
    { name: "publishedAtDesc", title: "公開日(新しい順)", by: [{ field: "publishedAt", direction: "desc" }] }
  ]
});