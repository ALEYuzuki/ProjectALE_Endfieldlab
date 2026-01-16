import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export default defineType({
  name: "characters_dps_ja",
  title: "DPSデータ（日本語）",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "character", title: "キャラクター", type: "reference", to: [{ type: "character_ja" }], validation: Rule => Rule.required() }),
    defineField({ name: "dps", title: "DPS", type: "number", validation: Rule => Rule.min(0) }),
    defineField({ name: "conditions", title: "条件/備考", type: "array", of: [{ type: "block" }] })
  ],
  preview: { select: { title: "character.name", subtitle: "dps" } }
});