export default function Loading() {
  return (
    <div style={{display:"grid", gap:12}}>
      {Array.from({length: 6}).map((_, i) => (
        <div key={i} style={{
          background:"var(--panel, #111)",
          border:"1px solid var(--line, #333)",
          height: 16, opacity:.6
        }}/>
      ))}
    </div>
  );
}