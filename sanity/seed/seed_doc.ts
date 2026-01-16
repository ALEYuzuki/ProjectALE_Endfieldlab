import {defineType, defineField} from "sanity";

export default defineType({
  name: "seed_doc",
  title: "Seed Doc",
  type: "document",
  fields: [
    defineField({name: "title", title: "Title", type: "string"}),
    defineField({name: "body", title: "Body", type: "array", of: [{type: "block"}]}),
  ],
});