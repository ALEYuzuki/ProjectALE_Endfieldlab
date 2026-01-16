import Link from "next/link";
import { format } from "date-fns";

export default function ItemCard({
  href, title, date, excerpt,
}: { href?: string; title: string; date?: string; excerpt?: string }) {
  return (
    <div className="card">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-base font-medium text-white">{title}</h3>
        {date ? <time className="text-xs text-neutral-500">{format(new Date(date), "yyyy-MM-dd")}</time> : null}
      </div>
      {excerpt ? <p className="text-sm text-neutral-300 mt-1 line-clamp-2">{excerpt}</p> : null}
      {href ? (
        <div className="mt-3">
          <Link href={href as any} className="nav-link underline underline-offset-4">Open</Link>
        </div>
      ) : null}
    </div>
  );
}