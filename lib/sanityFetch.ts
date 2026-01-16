import { sanityClient } from "./sanityClient";

type SanityFetchOptions = {
  query: string;
  params?: Record<string, any>;
  revalidate?: number; // NOTE: 現状は型だけ保持（Next側で使うなら別口）
  tags?: string[];     // NOTE: 同上
};

export async function sanityFetch<T>({
  query,
  params,
}: SanityFetchOptions): Promise<T> {
  const safeParams = params ?? {};
  // Sanity v7 の fetch は (query, params) だけを渡す
  return sanityClient.fetch<T>(query, safeParams as any);
}