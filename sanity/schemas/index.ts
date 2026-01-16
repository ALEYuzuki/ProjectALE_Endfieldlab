// sanity/schemas/index.ts
// 参照はすべて D:\ProjectALE_Endfieldlab\sanity\schemas 直下のフラット構成。
// ※ sectionSchemas（_sections.ts）は読み込みません（重複回避のため）。

// ===== 基本ドキュメント =====
import article_en from "./article_en";
import article_ja from "./article_ja";

import base_farming_en from "./base_farming_en";
import base_farming_ja from "./base_farming_ja";
import base_materials_en from "./base_materials_en";
import base_materials_ja from "./base_materials_ja";
import base_overview_en from "./base_overview_en";
import base_overview_ja from "./base_overview_ja";
import base_production_en from "./base_production_en";
import base_production_ja from "./base_production_ja";

import character_en from "./character_en";
import character_ja from "./character_ja";

import characters_dps_en from "./characters_dps_en";
import characters_dps_ja from "./characters_dps_ja";
import characters_equips_en from "./characters_equips_en";
import characters_equips_ja from "./characters_equips_ja";
import characters_overview_en from "./characters_overview_en";
import characters_overview_ja from "./characters_overview_ja";
import characters_party_en from "./characters_party_en";
import characters_party_ja from "./characters_party_ja";

import enemies_overview_en from "./enemies_overview_en";
import enemies_overview_ja from "./enemies_overview_ja";
import enemy_bosses_en from "./enemy_bosses_en";
import enemy_bosses_ja from "./enemy_bosses_ja";
import enemy_en from "./enemy_en";
import enemy_ja from "./enemy_ja";
import enemy_mid_en from "./enemy_mid_en";
import enemy_mid_ja from "./enemy_mid_ja";
import enemy_small_en from "./enemy_small_en";
import enemy_small_ja from "./enemy_small_ja";

import events_en from "./events_en";
import events_ja from "./events_ja";

import field_mats_char_en from "./field_mats_char_en";
import field_mats_char_ja from "./field_mats_char_ja";
import field_mats_weapon_en from "./field_mats_weapon_en";
import field_mats_weapon_ja from "./field_mats_weapon_ja";
import field_other_en from "./field_other_en";
import field_other_ja from "./field_other_ja";
import field_overview_en from "./field_overview_en";
import field_overview_ja from "./field_overview_ja";

import news_en from "./news_en";
import news_ja from "./news_ja";

import research_buffs_en from "./research_buffs_en";
import research_buffs_ja from "./research_buffs_ja";
import research_calc_en from "./research_calc_en";
import research_calc_ja from "./research_calc_ja";
import research_en from "./research_en";
import research_ja from "./research_ja";

import siteSettings_en from "./siteSettings_en";
import siteSettings_ja from "./siteSettings_ja";

import weapon_en from "./weapon_en";
import weapon_ja from "./weapon_ja";
import weapon_traits_en from "./weapon_traits_en";
import weapon_traits_ja from "./weapon_traits_ja";
import weapons_overview_en from "./weapons_overview_en";
import weapons_overview_ja from "./weapons_overview_ja";
import weaponSkill_en from "./weaponSkill_en";
import weaponSkill_ja from "./weaponSkill_ja";

// ===== サイト・ポリシー／法務系（schemas 直下に配置）=====
import site_overview_en from "./site_overview_en";
import site_overview_ja from "./site_overview_ja";
import policy_index_en from "./policy_index_en";
import policy_index_ja from "./policy_index_ja";
import policy_privacy_en from "./policy_privacy_en";
import policy_privacy_ja from "./policy_privacy_ja";
import policy_ads_en from "./policy_ads_en";
import policy_ads_ja from "./policy_ads_ja";
import policy_disclaimer_en from "./policy_disclaimer_en";
import policy_disclaimer_ja from "./policy_disclaimer_ja";
import policy_cookie_en from "./policy_cookie_en";
import policy_cookie_ja from "./policy_cookie_ja";
import policy_copyright_en from "./policy_copyright_en";
import policy_copyright_ja from "./policy_copyright_ja";
import policy_contact_en from "./policy_contact_en";
import policy_contact_ja from "./policy_contact_ja";
import policy_terms_en from "./policy_terms_en";
import policy_terms_ja from "./policy_terms_ja";

// ===== ここで配列に集約（重複なし）=====
export const schemaTypes = [
  // 記事
  article_en, article_ja,

  // 基地
  base_farming_en, base_farming_ja,
  base_materials_en, base_materials_ja,
  base_overview_en, base_overview_ja,
  base_production_en, base_production_ja,

  // キャラクター
  character_en, character_ja,
  characters_dps_en, characters_dps_ja,
  characters_equips_en, characters_equips_ja,
  characters_overview_en, characters_overview_ja,
  characters_party_en, characters_party_ja,

  // 敵
  enemies_overview_en, enemies_overview_ja,
  enemy_bosses_en, enemy_bosses_ja,
  enemy_en, enemy_ja,
  enemy_mid_en, enemy_mid_ja,
  enemy_small_en, enemy_small_ja,

  // イベント / ニュース
  events_en, events_ja,
  news_en, news_ja,

  // フィールド
  field_mats_char_en, field_mats_char_ja,
  field_mats_weapon_en, field_mats_weapon_ja,
  field_other_en, field_other_ja,
  field_overview_en, field_overview_ja,

  // 研究
  research_buffs_en, research_buffs_ja,
  research_calc_en, research_calc_ja,
  research_en, research_ja,

  // サイト設定
  siteSettings_en, siteSettings_ja,

  // 武器
  weapon_en, weapon_ja,
  weapon_traits_en, weapon_traits_ja,
  weapons_overview_en, weapons_overview_ja,
  weaponSkill_en, weaponSkill_ja,

  // サイト概要 & ポリシー
  site_overview_en, site_overview_ja,
  policy_index_en, policy_index_ja,
  policy_privacy_en, policy_privacy_ja,
  policy_ads_en, policy_ads_ja,
  policy_disclaimer_en, policy_disclaimer_ja,
  policy_cookie_en, policy_cookie_ja,
  policy_copyright_en, policy_copyright_ja,
  policy_contact_en, policy_contact_ja,
  policy_terms_en, policy_terms_ja
];

// 便利: すべての type.name 一覧
export const typeNames = (schemaTypes as any[])
  .map((t) => t?.name)
  .filter(Boolean) as string[];

export default schemaTypes;
