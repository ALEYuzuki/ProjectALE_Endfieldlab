import { getDict, t } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDict(locale as any);
  return (
    <div className="card">
      <h2 className="card-title">{t(dict, "menu.skills")}</h2>
      <p className="text-sm text-neutral-400">Coming soon...</p>
    </div>
  );
}