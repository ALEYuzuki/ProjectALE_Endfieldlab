import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";
import { slugField, timestamps, ogFields } from "./_shared";

export default defineType({
  name: "base_materials_en",
  title: "Materials (English)",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: Rule => Rule.required() }),
    slugField(),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3 }),
    defineField({ name: "body", title: "Body", type: "array", of: [{ type: "block" }, { type: "image", options: { hotspot: true } }] }),
    ...ogFields,
    ...timestamps
  ],
  preview: { select: { title: "title" } }
});