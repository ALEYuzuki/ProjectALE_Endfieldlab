import { defineType, defineField } from "sanity";
import { CalendarIcon } from "@sanity/icons";
import { timestamps, ogFields } from "./_shared";

export default defineType({
  name: "events_ja",
  title: "イベント（日本語）",
  type: "document",
  icon: CalendarIcon,
  fields: [
    defineField({ name: "title", title: "タイトル", type: "string", validation: Rule => Rule.required() }),
    defineField({ name: "startAt", title: "開始日時", type: "datetime" }),
    defineField({ name: "endAt", title: "終了日時", type: "datetime" }),
    defineField({ name: "body", title: "本文", type: "array", of: [{ type: "block" }] }),
    ...ogFields, ...timestamps
  ],
  orderings: [
    { name: "startAtDesc", title: "開始(新しい順)", by: [{ field: "startAt", direction: "desc" }] }
  ]
});