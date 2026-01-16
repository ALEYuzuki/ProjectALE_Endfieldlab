import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export default defineType({
  name: "siteSettings_en",
  title: "Site Settings (English)",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "siteTitle", title: "Site Title", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 })
  ]
});