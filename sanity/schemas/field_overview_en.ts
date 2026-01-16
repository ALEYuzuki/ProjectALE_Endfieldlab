import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";
import { timestamps, ogFields } from "./_shared";

export default defineType({
  name: "field_overview_en",
  title: "Field (Overview)",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: Rule => Rule.required() }),
    defineField({ name: "body", title: "Body", type: "array", of: [{ type: "block" }] }),
    ...ogFields, ...timestamps
  ]
});