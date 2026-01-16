import { defineType, defineField } from "sanity";

export default defineType({
  name: "site_overview_en",
  title: "Site Overview (EN)",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime" }),
    defineField({ name: "body", title: "Body", type: "array", of: [{ type: "block" }] })
  ]
});