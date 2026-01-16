import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";
import { slugField, timestamps, ogFields } from "./_shared";

export default defineType({
  name: "weapon_en",
  title: "Weapon (English)",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: Rule => Rule.required() }),
    slugField(),
    defineField({
      name: "weaponType",
      title: "Type",
      type: "string",
      options: { list: ["Sword","Greatsword","Lance","Bow","Staff","Gun","Other"] }
    }),
    defineField({ name: "rarity", title: "Rarity", type: "number", validation: Rule => Rule.min(1).max(6) }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    ...ogFields,
    ...timestamps
  ],
  preview: { select: { title: "name", subtitle: "weaponType" } }
});