import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export default defineType({
  name: "characters_dps_en",
  title: "DPS Data (English)",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "character", title: "Character", type: "reference", to: [{ type: "character_en" }], validation: Rule => Rule.required() }),
    defineField({ name: "dps", title: "DPS", type: "number", validation: Rule => Rule.min(0) }),
    defineField({ name: "conditions", title: "Conditions/Notes", type: "array", of: [{ type: "block" }] })
  ],
  preview: { select: { title: "character.name", subtitle: "dps" } }
});