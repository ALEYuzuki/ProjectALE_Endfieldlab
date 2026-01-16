import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";
import { slugField, timestamps, ogFields } from "./_shared";

export default defineType({
  name: "article_en",
  title: "Article (English)",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: Rule => Rule.required() }),
    slugField(),
    defineField({
      name: "section",
      title: "Section",
      type: "string",
      options: {
        list: [
          { title: "News", value: "news" },
          { title: "Events", value: "events" },
          { title: "Research", value: "research" },
          { title: "Base", value: "base" },
          { title: "Field", value: "field" },
          { title: "Other", value: "other" }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3 }),
    defineField({ name: "body", title: "Body", type: "array", of: [{ type: "block" }, { type: "image", options: { hotspot: true } }] }),
    ...ogFields,
    ...timestamps
  ],
  preview: { select: { title: "title", subtitle: "section" } }
});