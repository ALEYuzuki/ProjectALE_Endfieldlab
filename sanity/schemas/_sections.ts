import { makeDoc } from "./_sectionFactory";

/** サイトの各カテゴリに対応するスキーマ（日本語/英語） */
export const sectionSchemas = [
  // 検証情報
  makeDoc("research_ja","検証情報"),
  makeDoc("research_en","Research（英語）"),
  makeDoc("research_calc_ja","ダメージ計算式"),
  makeDoc("research_calc_en","Damage Calculation（英語）"),
  makeDoc("research_buffs_ja","バフ・デバフ効果"),
  makeDoc("research_buffs_en","Buffs & Debuffs（英語）"),

  // 利用規約
  makeDoc("terms_ja","利用規約"),
  makeDoc("terms_en","Terms of Use（英語）"),

  // キャラクター
  makeDoc("characters_overview_ja","キャラクター概要"),
  makeDoc("characters_overview_en","Characters Overview（英語）"),
  makeDoc("characters_builds_ja","おすすめ編成"),
  makeDoc("characters_builds_en","Recommended Builds（英語）"),
  makeDoc("characters_dps_ja","DPSデータ"),
  makeDoc("characters_dps_en","DPS Data（英語）"),
  makeDoc("characters_gear_ja","装備・アクセサリー"),
  makeDoc("characters_gear_en","Gear & Accessories（英語）"),

  // 武器
  makeDoc("weapons_overview_ja","武器情報"),
  makeDoc("weapons_overview_en","Weapons Overview（英語）"),
  makeDoc("weapons_skills_ja","武器スキル"),
  makeDoc("weapons_skills_en","Weapon Skills（英語）"),
  makeDoc("weapons_traits_ja","基質"),
  makeDoc("weapons_traits_en","Traits（英語）"),

  // 基地
  makeDoc("base_overview_ja","基地概要"),
  makeDoc("base_overview_en","Base Overview（英語）"),
  makeDoc("base_production_ja","生産・加工施設"),
  makeDoc("base_production_en","Production / Processing（英語）"),
  makeDoc("base_agriculture_ja","農業"),
  makeDoc("base_agriculture_en","Agriculture（英語）"),
  makeDoc("base_materials_ja","素材"),
  makeDoc("base_materials_en","Materials（英語）"),

  // フィールド
  makeDoc("field_overview_ja","フィールド概要"),
  makeDoc("field_overview_en","Field Overview（英語）"),
  makeDoc("field_char_mats_ja","強化素材（キャラクター）"),
  makeDoc("field_char_mats_en","Upgrade Mats (Characters)（英語）"),
  makeDoc("field_weapon_mats_ja","強化素材（武器）"),
  makeDoc("field_weapon_mats_en","Upgrade Mats (Weapons)（英語）"),
  makeDoc("field_misc_ja","その他"),
  makeDoc("field_misc_en","Misc（英語）"),

  // 敵情報
  makeDoc("enemies_overview_ja","敵情報概要"),
  makeDoc("enemies_overview_en","Enemies Overview（英語）"),
  makeDoc("enemies_boss_ja","ボス"),
  makeDoc("enemies_boss_en","Boss（英語）"),
  makeDoc("enemies_medium_ja","中型"),
  makeDoc("enemies_medium_en","Medium（英語）"),
  makeDoc("enemies_small_ja","小型"),
  makeDoc("enemies_small_en","Small（英語）"),

  // ホーム（ニュース・イベント）
  makeDoc("news_ja","ニュース"),
  makeDoc("news_en","News（英語）"),
  makeDoc("events_ja","イベント"),
  makeDoc("events_en","Events（英語）")
];