import { defineType, defineField } from "sanity";

export default defineType({
  name: "policy_cookie_ja",
  title: "Cookieポリシー（日本語）",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime" }),
    defineField({ name: "body", title: "Body", type: "array", of: [{ type: "block" }] })
  ]
});