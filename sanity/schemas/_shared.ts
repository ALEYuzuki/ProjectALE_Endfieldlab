import { defineField } from "sanity";

export const slugField = (name = "slug") =>
  defineField({
    name,
    title: "Slug",
    type: "slug",
    options: { source: "title", maxLength: 96 }
  });

export const timestamps = [
  defineField({ name: "publishedAt", title: "Published At", type: "datetime" }),
  defineField({ name: "updatedAt", title: "Updated At", type: "datetime" })
];

export const ogFields = [
  defineField({ name: "ogTitle", title: "OG Title", type: "string" }),
  defineField({ name: "ogDescription", title: "OG Description", type: "text" }),
  defineField({ name: "ogImage", title: "OG Image", type: "image" })
];