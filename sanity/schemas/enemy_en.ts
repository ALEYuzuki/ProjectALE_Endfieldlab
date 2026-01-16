import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";
import { slugField, timestamps } from "./_shared";

export default defineType({
  name: "enemy_en",
  title: "Enemy (English)",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: Rule => Rule.required() }),
    slugField(),
    defineField({ name: "class", title: "Class", type: "string", options: { list: [
      { title: "Bosses", value: "bosses" }, { title: "Medium", value: "mid" }, { title: "Small", value: "small" }
    ] } }),
    defineField({ name: "notes", title: "Notes", type: "array", of: [{ type: "block" }] }),
    ...timestamps
  ],
  preview: { select: { title: "name", subtitle: "class" } }
});