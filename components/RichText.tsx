// components/RichText.tsx
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlForImage } from "@/lib/sanityClient";

type Props = { value: any; className?: string };

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value) return null;

      // 好きな基準サイズ（ここでは16:9を想定）
      const width = 800;
      const height = 450;

      const url = urlForImage(value).width(width).height(height).url();

      return (
        <figure className="my-6">
          <Image
            src={url}
            alt={value.alt || ""}
            width={width}
            height={height}
            sizes="(max-width: 768px) 100vw, 800px"
            className="h-auto w-full rounded-lg object-cover"
          />
          {value.caption && (
            <figcaption className="mt-2 text-sm text-neutral-400">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export function RichText({ value, className }: Props) {
  if (!value) return null;
  return (
    <div className={className ?? "prose prose-invert prose-neutral max-w-none"}>
      <PortableText value={value} components={components} />
    </div>
  );
}

export default RichText;
