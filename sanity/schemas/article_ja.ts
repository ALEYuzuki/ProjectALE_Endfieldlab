import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";
import { slugField, timestamps, ogFields } from "./_shared";

export default defineType({
  name: "article_ja",
  title: "記事（日本語）",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "title", title: "タイトル", type: "string", validation: Rule => Rule.required() }),
    slugField(),
    defineField({
      name: "section",
      title: "セクション",
      type: "string",
      options: {
        list: [
          { title: "ニュース", value: "news" },
          { title: "イベント", value: "events" },
          { title: "検証情報", value: "research" },
          { title: "基地", value: "base" },
          { title: "フィールド", value: "field" },
          { title: "その他", value: "other" }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({ name: "excerpt", title: "概要", type: "text", rows: 3 }),
    defineField({ name: "body", title: "本文", type: "array", of: [{ type: "block" }, { type: "image", options: { hotspot: true } }] }),
    ...ogFields,
    ...timestamps
  ],
  preview: { select: { title: "title", subtitle: "section" } }
});