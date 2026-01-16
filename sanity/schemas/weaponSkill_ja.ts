import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";
import { slugField, timestamps } from "./_shared";

export default defineType({
  name: "weaponSkill_ja",
  title: "武器スキル（日本語）",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "name", title: "スキル名", type: "string", validation: Rule => Rule.required() }),
    slugField(),
    defineField({
      name: "weapon",
      title: "対応武器",
      type: "reference",
      to: [{ type: "weapon_ja" }],
      validation: Rule => Rule.required()
    }),
    defineField({ name: "cooldown", title: "クールダウン", type: "number" }),
    defineField({ name: "effect", title: "効果", type: "array", of: [{ type: "block" }] }),
    ...timestamps
  ],
  preview: { select: { title: "name", subtitle: "weapon.name" } }
});