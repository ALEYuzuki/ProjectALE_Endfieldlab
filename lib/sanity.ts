import "server-only";
import { createClient } from "next-sanity";
import env from "@/sanity/env";

export const sanityClient = createClient({
  projectId: env.projectId,
  dataset: env.dataset,
  apiVersion: env.apiVersion,
  useCdn: true,
});