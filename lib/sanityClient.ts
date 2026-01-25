// sanityClient.ts
import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // ← 画像読み込みでは true 推奨
  perspective: "published",
});

// ✅ default import廃止 → named exportに変更
const builder = createImageUrlBuilder(sanityClient);

/**
 * Sanity 画像オブジェクトから URL を生成するヘルパー
 * 例: urlForImage(image).width(800).height(450).url()
 */
export function urlForImage(source: any) {
  return builder.image(source);
}

export default sanityClient;
