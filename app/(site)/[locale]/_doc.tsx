import RichText from "@/components/RichText";

/**
 * 共通ドキュメント描画ヘルパー
 * 各ページからは:
 *   - default import:  import Doc from "../../_doc";
 *   - named import:    import { Doc } from "../../_doc";
 *   - named import:    import { DocSection } from "../../_doc";
 */
export type DocProps = {
  locale: string;
  titleJa: string;
  titleEn?: string;
  jaType: string;
  enType: string;
};

export async function Doc(props: DocProps) {
  const { locale, titleJa, titleEn, jaType, enType } = props;
  const base = (locale || "ja").split("-")[0];
  const type = base === "ja" ? jaType : enType;

  const { getOptionalDocByType } = await import("./_content");
  const doc: any = await getOptionalDocByType(type);

  const title =
    doc?.title ?? (base === "ja" ? titleJa : titleEn ?? titleJa);

  return (
    <article style={{ lineHeight: 1.6 }}>
      <h1 style={{ fontSize: "1.6rem", marginBottom: 12 }}>{title}</h1>
      {doc?.body ? (
        <RichText value={doc.body} />
      ) : (
        <div style={{ opacity: 0.7 }}>
          {base === "ja"
            ? "このセクションにはまだコンテンツが登録されていません。"
            : "No content has been registered for this section yet."}
        </div>
      )}
    </article>
  );
}

/** Doc と同じものを DocSection という名前でも提供（既存コード互換用） */
export async function DocSection(props: DocProps) {
  return Doc(props);
}

// default でも使えるようにしておく
export default Doc;