const env = {
  projectId: process.env.SANITY_PROJECT_ID || "kehmntm3",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: process.env.SANITY_API_VERSION || "2025-01-01",
  writeToken: process.env.SANITY_WRITE_TOKEN, // server-side only
};

if (!env.projectId || !env.dataset) {
  // 開発中は落とさず警告に留める
  console.warn("[sanity/env] projectId/dataset が未設定です。 .env.local を確認してください。");
}

export default env;