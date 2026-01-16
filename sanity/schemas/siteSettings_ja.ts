import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export default defineType({
  name: "siteSettings_ja",
  title: "サイト設定（日本語）",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "siteTitle", title: "サイト名", type: "string" }),
    defineField({ name: "description", title: "説明", type: "text", rows: 3 })
  ]
});