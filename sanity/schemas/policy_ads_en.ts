import { defineType, defineField } from "sanity";

export default defineType({
  name: "policy_ads_en",
  title: "Advertising Policy (EN)",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime" }),
    defineField({ name: "body", title: "Body", type: "array", of: [{ type: "block" }] })
  ]
});