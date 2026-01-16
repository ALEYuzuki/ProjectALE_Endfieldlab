import { defineType, defineField } from "sanity";
import { CalendarIcon } from "@sanity/icons";
import { timestamps, ogFields } from "./_shared";

export default defineType({
  name: "events_en",
  title: "Events (EN)",
  type: "document",
  icon: CalendarIcon,
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: Rule => Rule.required() }),
    defineField({ name: "startAt", title: "Starts At", type: "datetime" }),
    defineField({ name: "endAt", title: "Ends At", type: "datetime" }),
    defineField({ name: "body", title: "Body", type: "array", of: [{ type: "block" }] }),
    ...ogFields, ...timestamps
  ],
  orderings: [
    { name: "startAtDesc", title: "Start (Newest)", by: [{ field: "startAt", direction: "desc" }] }
  ]
});