import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export default defineType({
  name: "characters_equips_en",
  title: "Equipment & Accessories (English)",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "title", title: "Set Name", type: "string", validation: Rule => Rule.required() }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        {
          name: "item",
          title: "Item",
          type: "object",
          fields: [
            { name: "name", title: "Name", type: "string" },
            { name: "slot", title: "Slot", type: "string" },
            { name: "notes", title: "Notes", type: "text", rows: 2 }
          ]
        }
      ]
    })
  ],
  preview: { select: { title: "title" } }
});