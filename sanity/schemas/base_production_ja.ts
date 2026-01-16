import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";
import { slugField, timestamps, ogFields } from "./_shared";

export default defineType({
  name: "base_production_ja",
  title: "生産・加工施設（日本語）",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "title", title: "タイトル", type: "string", validation: Rule => Rule.required() }),
    slugField(),
    defineField({ name: "excerpt", title: "概要", type: "text", rows: 3 }),
    defineField({ name: "body", title: "本文", type: "array", of: [{ type: "block" }, { type: "image", options: { hotspot: true } }] }),
    ...ogFields,
    ...timestamps
  ],
  preview: { select: { title: "title" } }
});