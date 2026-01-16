export default function PageHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-4">
      <h1 className="text-xl font-semibold text-white">{title}</h1>
      {hint ? <p className="text-sm text-neutral-400 mt-1">{hint}</p> : null}
    </div>
  );
}