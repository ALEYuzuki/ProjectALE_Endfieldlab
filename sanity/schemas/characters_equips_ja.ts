import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export default defineType({
  name: "characters_equips_ja",
  title: "装備・アクセサリー（日本語）",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "title", title: "セット名", type: "string", validation: Rule => Rule.required() }),
    defineField({
      name: "items",
      title: "アイテム",
      type: "array",
      of: [
        {
          name: "item",
          title: "アイテム",
          type: "object",
          fields: [
            { name: "name", title: "名称", type: "string" },
            { name: "slot", title: "部位", type: "string" },
            { name: "notes", title: "備考", type: "text", rows: 2 }
          ]
        }
      ]
    })
  ],
  preview: { select: { title: "title" } }
});