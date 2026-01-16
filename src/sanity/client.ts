import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID || "kehmntm3";
const dataset = process.env.SANITY_DATASET || "production";
const apiVersion = process.env.SANITY_API_VERSION || "2025-01-01";
const token = process.env.SANITY_WRITE_TOKEN; // only server-side use when needed

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token,
});
