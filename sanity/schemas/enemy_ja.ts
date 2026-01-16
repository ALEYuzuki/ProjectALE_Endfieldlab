import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";
import { slugField, timestamps } from "./_shared";

export default defineType({
  name: "enemy_ja",
  title: "敵（日本語）",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "name", title: "名称", type: "string", validation: Rule => Rule.required() }),
    slugField(),
    defineField({ name: "class", title: "分類", type: "string", options: { list: [
      { title: "ボス", value: "bosses" }, { title: "中型", value: "mid" }, { title: "小型", value: "small" }
    ] } }),
    defineField({ name: "notes", title: "メモ", type: "array", of: [{ type: "block" }] }),
    ...timestamps
  ],
  preview: { select: { title: "name", subtitle: "class" } }
});