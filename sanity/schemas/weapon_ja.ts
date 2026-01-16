import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";
import { slugField, timestamps, ogFields } from "./_shared";

export default defineType({
  name: "weapon_ja",
  title: "武器（日本語）",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "name", title: "名称", type: "string", validation: Rule => Rule.required() }),
    slugField(),
    defineField({
      name: "weaponType",
      title: "武器種",
      type: "string",
      options: { list: ["片手剣","両手剣","槍","弓","杖","銃","その他"] }
    }),
    defineField({ name: "rarity", title: "レアリティ", type: "number", validation: Rule => Rule.min(1).max(6) }),
    defineField({ name: "description", title: "説明", type: "text", rows: 3 }),
    ...ogFields,
    ...timestamps
  ],
  preview: { select: { title: "name", subtitle: "weaponType" } }
});