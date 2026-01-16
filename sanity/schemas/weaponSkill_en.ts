import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";
import { slugField, timestamps } from "./_shared";

export default defineType({
  name: "weaponSkill_en",
  title: "Weapon Skill (English)",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: Rule => Rule.required() }),
    slugField(),
    defineField({
      name: "weapon",
      title: "Weapon",
      type: "reference",
      to: [{ type: "weapon_en" }],
      validation: Rule => Rule.required()
    }),
    defineField({ name: "cooldown", title: "Cooldown", type: "number" }),
    defineField({ name: "effect", title: "Effect", type: "array", of: [{ type: "block" }] }),
    ...timestamps
  ],
  preview: { select: { title: "name", subtitle: "weapon.name" } }
});