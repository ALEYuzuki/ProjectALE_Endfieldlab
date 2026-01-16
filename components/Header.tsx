"use client";
import Link from "next/link";
import { t } from "@/lib/i18n";
import LanguageSelect from "@/components/LanguageSelect";

type Props = { locale: "ja" | "en"; dict: any };

export function Header({ locale, dict }: Props) {
  const title = dict?.site?.title ?? "ProjectALEEndfield Lab";
  const terms = t(
    dict,
    "menu.terms",
    locale === "ja" ? "利用規約" : "Terms of Service"
  );

  return (
    <header className="header-glass w-full">
      <div className="header-pad">
        <div className="h-14 flex items-center justify-between max-w-[1400px] mx-auto">
          <Link
            href={`/${locale}` as any}
            className="text-base font-semibold text-white whitespace-nowrap"
          >
            {title}
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/terms` as any}
              className="nav-link"
            >
              {terms}
            </Link>
            <LanguageSelect locale={locale} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
