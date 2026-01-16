import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";
import { slugField, timestamps } from "./_shared";

export default defineType({
  name: "enemy_bosses_en",
  title: "Enemies (Bosses, EN)",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: Rule => Rule.required() }),
    slugField(),
    defineField({ name: "notes", title: "Notes", type: "array", of: [{ type: "block" }] }),
    ...timestamps
  ],
  preview: { select: { title: "name" } }
});