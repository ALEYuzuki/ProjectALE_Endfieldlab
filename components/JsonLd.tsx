type JsonLdProps = { json: Record<string, any> };
export default function JsonLd({ json }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
      suppressHydrationWarning
    />
  );
}