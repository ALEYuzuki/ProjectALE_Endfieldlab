import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export default defineType({
  name: "characters_party_ja",
  title: "おすすめ編成（日本語）",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "title", title: "編成名", type: "string", validation: Rule => Rule.required() }),
    defineField({
      name: "members",
      title: "メンバー",
      type: "array",
      of: [{ type: "reference", to: [{ type: "character_ja" }] }],
      validation: Rule => Rule.min(1)
    }),
    defineField({ name: "notes", title: "メモ", type: "array", of: [{ type: "block" }] })
  ],
  preview: { select: { title: "title" } }
});