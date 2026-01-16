import { defineType, defineField } from "sanity";

export default defineType({
  name: "policy_copyright_ja",
  title: "著作権・通報（日本語）",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime" }),
    defineField({ name: "body", title: "Body", type: "array", of: [{ type: "block" }] })
  ]
});