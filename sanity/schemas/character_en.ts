import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";
import { slugField, timestamps, ogFields } from "./_shared";

export default defineType({
  name: "character_en",
  title: "Character (English)",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (R:any)=>R.required() }),
    slugField(),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({ name: "bio", title: "Overview", type: "array", of: [{ type: "block" }] }),
    ...ogFields,
    ...timestamps
  ],
  preview: { select: { title: "name", subtitle: "role" } }
});