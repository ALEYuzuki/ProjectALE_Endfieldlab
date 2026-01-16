import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";
import { slugField, timestamps } from "./_shared";

export default defineType({
  name: "enemy_small_ja",
  title: "敵（小型・日本語）",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "name", title: "名称", type: "string", validation: Rule => Rule.required() }),
    slugField(),
    defineField({ name: "notes", title: "メモ", type: "array", of: [{ type: "block" }] }),
    ...timestamps
  ],
  preview: { select: { title: "name" } }
});