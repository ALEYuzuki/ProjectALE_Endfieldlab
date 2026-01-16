import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export default defineType({
  name: "characters_party_en",
  title: "Recommended Teams (English)",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "title", title: "Team Name", type: "string", validation: Rule => Rule.required() }),
    defineField({
      name: "members",
      title: "Members",
      type: "array",
      of: [{ type: "reference", to: [{ type: "character_en" }] }],
      validation: Rule => Rule.min(1)
    }),
    defineField({ name: "notes", title: "Notes", type: "array", of: [{ type: "block" }] })
  ],
  preview: { select: { title: "title" } }
});