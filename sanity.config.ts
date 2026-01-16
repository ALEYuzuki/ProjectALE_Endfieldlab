import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import env from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemas";
import { deskStructure } from "@/sanity/deskStructure";

export default defineConfig({
  name: "default",
  title: "ProjectALE Studio",
  projectId: env.projectId,
  dataset: env.dataset,
  basePath: "/studio",
  schema: { types: schemaTypes },
  plugins: [
    deskTool({ structure: deskStructure }),
    visionTool()
  ]
});