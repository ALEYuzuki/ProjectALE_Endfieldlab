import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";
import { timestamps, ogFields } from "./_shared";

export default defineType({
  name: "research_calc_ja",
  title: "ダメージ計算式（日本語）",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "title", title: "タイトル", type: "string", validation: Rule => Rule.required() }),
    defineField({ name: "body", title: "本文", type: "array", of: [{ type: "block" }] }),
    ...ogFields, ...timestamps
  ]
});