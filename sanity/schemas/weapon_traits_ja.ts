import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";
import { slugField, timestamps } from "./_shared";

export default defineType({
  name: "weapon_traits_ja",
  title: "基質（日本語）",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "name", title: "名称", type: "string", validation: Rule => Rule.required() }),
    slugField(),
    defineField({ name: "description", title: "説明", type: "array", of: [{ type: "block" }] }),
    ...timestamps
  ],
  preview: { select: { title: "name" } }
});