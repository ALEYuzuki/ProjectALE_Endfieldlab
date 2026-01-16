import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";
import { timestamps, ogFields } from "./_shared";

export default defineType({
  name: "base_overview_ja",
  title: "基地（見出し）",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "title", title: "タイトル", type: "string", validation: Rule => Rule.required() }),
    defineField({ name: "body", title: "本文", type: "array", of: [{ type: "block" }] }),
    ...ogFields, ...timestamps
  ]
});