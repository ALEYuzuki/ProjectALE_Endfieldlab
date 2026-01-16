export default async function EnemiesIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const base = `/${locale}/enemies`;
  const items = [
    { href: `${base}/boss`,   label: "ボス" },
    { href: `${base}/medium`, label: "中型" },
    { href: `${base}/small`,  label: "小型" },
  ];
  return (
    <article>
      <h1 style={{fontSize:"1.6rem",marginBottom:12}}>敵情報</h1>
      <ul style={{display:"grid", gap:8, paddingLeft:18}}>
        {items.map((it) => (
          <li key={it.href}>
            <a href={it.href} className="aside-link">{it.label}</a>
          </li>
        ))}
      </ul>
    </article>
  );
}