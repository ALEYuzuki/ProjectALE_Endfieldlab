import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";
import { slugField, timestamps, ogFields } from "./_shared";

export default defineType({
  name: "character_ja",
  title: "キャラクター（日本語）",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "name", title: "名称", type: "string", validation: (R:any)=>R.required() }),
    slugField(),
    defineField({ name: "role", title: "役割", type: "string" }),
    defineField({ name: "bio", title: "解説", type: "array", of: [{ type: "block" }] }),
    ...ogFields,
    ...timestamps
  ],
  preview: { select: { title: "name", subtitle: "role" } }
});