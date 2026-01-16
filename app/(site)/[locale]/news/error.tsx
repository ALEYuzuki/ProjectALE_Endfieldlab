"use client";
export default function ErrorComp({ error }: { error: Error & { digest?: string } }) {
  console.error(error);
  return (
    <div className="card">
      <div className="text-red-400 font-medium mb-1">Failed to load</div>
      <div className="text-sm text-neutral-400">Please try again later.</div>
    </div>
  );
}