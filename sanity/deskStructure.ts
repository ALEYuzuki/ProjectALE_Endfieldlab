// sanity/deskStructure.ts
import type { StructureBuilder } from "sanity/desk";

export const deskStructure = (S: StructureBuilder) =>
  S.list().title("コンテンツ").id("root_content").items([
    // ===== 日本語 =====
    S.listItem().title("日本語").id("lang_ja").child(
      S.list().title("日本語").id("list_lang_ja").items([
        S.listItem().title("ホーム").id("ja_home").child(
          S.list().title("ホーム").id("ja_home_list").items([
            S.documentTypeListItem("news_ja").title("ニュース").id("ja_news"),
            S.documentTypeListItem("events_ja").title("イベント").id("ja_events"),
          ])
        ),
        S.listItem().title("検証情報").id("ja_research").child(
          S.list().title("検証情報").id("ja_research_list").items([
            S.documentTypeListItem("research_ja").title("検証情報本文").id("ja_research_doc"),
            S.documentTypeListItem("research_calc_ja").title("ダメージ計算式").id("ja_research_calc"),
            S.documentTypeListItem("research_buffs_ja").title("バフ・デバフ効果").id("ja_research_buffs"),
          ])
        ),
        S.listItem().title("キャラクター").id("ja_characters").child(
          S.list().title("キャラクター").id("ja_characters_list").items([
            S.documentTypeListItem("characters_overview_ja").title("キャラクター概要").id("ja_char_overview"),
            S.documentTypeListItem("characters_party_ja").title("おすすめ編成").id("ja_char_party"),          // ← builds_ja → party_ja
            S.documentTypeListItem("characters_dps_ja").title("DPSデータ").id("ja_char_dps"),
            S.documentTypeListItem("characters_equips_ja").title("装備・アクセサリー").id("ja_char_equips"), // ← gear_ja → equips_ja
          ])
        ),
        S.listItem().title("武器").id("ja_weapons").child(
          S.list().title("武器").id("ja_weapons_list").items([
            S.documentTypeListItem("weapons_overview_ja").title("武器情報").id("ja_weapons_overview"),
            S.documentTypeListItem("weaponSkill_ja").title("武器スキル").id("ja_weapon_skills"),            // ← weapons_skills_ja → weaponSkill_ja
            S.documentTypeListItem("weapon_traits_ja").title("基質").id("ja_weapon_traits"),                // ← weapons_traits_ja → weapon_traits_ja
          ])
        ),
        S.listItem().title("基地").id("ja_base").child(
          S.list().title("基地").id("ja_base_list").items([
            S.documentTypeListItem("base_overview_ja").title("基地概要").id("ja_base_overview"),
            S.documentTypeListItem("base_production_ja").title("生産・加工施設").id("ja_base_production"),
            S.documentTypeListItem("base_farming_ja").title("農業").id("ja_base_farming"),                  // ← agriculture_ja → farming_ja
            S.documentTypeListItem("base_materials_ja").title("素材").id("ja_base_materials"),
          ])
        ),
        S.listItem().title("フィールド").id("ja_field").child(
          S.list().title("フィールド").id("ja_field_list").items([
            S.documentTypeListItem("field_overview_ja").title("フィールド概要").id("ja_field_overview"),
            S.documentTypeListItem("field_mats_char_ja").title("強化素材（キャラクター）").id("ja_field_mats_char"),   // ← field_char_mats_ja → field_mats_char_ja
            S.documentTypeListItem("field_mats_weapon_ja").title("強化素材（武器）").id("ja_field_mats_weapon"),       // ← field_weapon_mats_ja → field_mats_weapon_ja
            S.documentTypeListItem("field_other_ja").title("その他").id("ja_field_other"),                               // ← field_misc_ja → field_other_ja
          ])
        ),
        S.listItem().title("敵情報").id("ja_enemies").child(
          S.list().title("敵情報").id("ja_enemies_list").items([
            S.documentTypeListItem("enemies_overview_ja").title("敵情報概要").id("ja_enemies_overview"),
            S.documentTypeListItem("enemy_bosses_ja").title("ボス").id("ja_enemies_boss"),                 // ← enemies_boss_ja → enemy_bosses_ja
            S.documentTypeListItem("enemy_mid_ja").title("中型").id("ja_enemies_mid"),                    // ← enemies_medium_ja → enemy_mid_ja
            S.documentTypeListItem("enemy_small_ja").title("小型").id("ja_enemies_small"),
          ])
        ),
        S.listItem().title("その他").id("ja_misc").child(
          S.list().title("その他").id("ja_misc_list").items([
            S.documentTypeListItem("site_overview_ja").title("サイト概要").id("ja_site_overview"),
            S.documentTypeListItem("policy_index_ja").title("ポリシー").id("ja_policy_index"),
            S.documentTypeListItem("policy_terms_ja").title("利用規約").id("ja_policy_terms"),
            S.documentTypeListItem("policy_privacy_ja").title("個人情報ガイドライン").id("ja_policy_privacy"),
            S.documentTypeListItem("policy_ads_ja").title("広告ガイドライン").id("ja_policy_ads"),
            S.documentTypeListItem("policy_disclaimer_ja").title("免責事項").id("ja_policy_disclaimer"),
            S.documentTypeListItem("policy_cookie_ja").title("Cookieポリシー").id("ja_policy_cookie"),
            S.documentTypeListItem("policy_copyright_ja").title("著作権・通報（DMCA等）").id("ja_policy_copyright"),
            S.documentTypeListItem("policy_contact_ja").title("お問い合わせ").id("ja_policy_contact"),
          ])
        ),
      ])
    ),

    // ===== 英語 =====
    S.listItem().title("英語").id("lang_en").child(
      S.list().title("英語").id("list_lang_en").items([
        S.listItem().title("ホーム（英語）").id("en_home").child(
          S.list().title("ホーム（英語）").id("en_home_list").items([
            S.documentTypeListItem("news_en").title("ニュース（英語）").id("en_news"),
            S.documentTypeListItem("events_en").title("イベント（英語）").id("en_events"),
          ])
        ),
        S.listItem().title("検証情報（英語）").id("en_research").child(
          S.list().title("検証情報（英語）").id("en_research_list").items([
            S.documentTypeListItem("research_en").title("検証情報本文（英語）").id("en_research_doc"),
            S.documentTypeListItem("research_calc_en").title("ダメージ計算式（英語）").id("en_research_calc"),
            S.documentTypeListItem("research_buffs_en").title("バフ・デバフ効果（英語）").id("en_research_buffs"),
          ])
        ),
        S.listItem().title("キャラクター（英語）").id("en_characters").child(
          S.list().title("キャラクター（英語）").id("en_characters_list").items([
            S.documentTypeListItem("characters_overview_en").title("キャラクター概要（英語）").id("en_char_overview"),
            S.documentTypeListItem("characters_party_en").title("おすすめ編成（英語）").id("en_char_party"),
            S.documentTypeListItem("characters_dps_en").title("DPSデータ（英語）").id("en_char_dps"),
            S.documentTypeListItem("characters_equips_en").title("装備・アクセサリー（英語）").id("en_char_equips"),
          ])
        ),
        S.listItem().title("武器（英語）").id("en_weapons").child(
          S.list().title("武器（英語）").id("en_weapons_list").items([
            S.documentTypeListItem("weapons_overview_en").title("武器情報（英語）").id("en_weapons_overview"),
            S.documentTypeListItem("weaponSkill_en").title("武器スキル（英語）").id("en_weapon_skills"),
            S.documentTypeListItem("weapon_traits_en").title("基質（英語）").id("en_weapon_traits"),
          ])
        ),
        S.listItem().title("基地（英語）").id("en_base").child(
          S.list().title("基地（英語）").id("en_base_list").items([
            S.documentTypeListItem("base_overview_en").title("基地概要（英語）").id("en_base_overview"),
            S.documentTypeListItem("base_production_en").title("生産・加工施設（英語）").id("en_base_production"),
            S.documentTypeListItem("base_farming_en").title("農業（英語）").id("en_base_farming"),
            S.documentTypeListItem("base_materials_en").title("素材（英語）").id("en_base_materials"),
          ])
        ),
        S.listItem().title("フィールド（英語）").id("en_field").child(
          S.list().title("フィールド（英語）").id("en_field_list").items([
            S.documentTypeListItem("field_overview_en").title("フィールド概要（英語）").id("en_field_overview"),
            S.documentTypeListItem("field_mats_char_en").title("強化素材（キャラクター）（英語）").id("en_field_mats_char"),
            S.documentTypeListItem("field_mats_weapon_en").title("強化素材（武器）（英語）").id("en_field_mats_weapon"),
            S.documentTypeListItem("field_other_en").title("その他（英語）").id("en_field_other"),
          ])
        ),
        S.listItem().title("敵情報（英語）").id("en_enemies").child(
          S.list().title("敵情報（英語）").id("en_enemies_list").items([
            S.documentTypeListItem("enemies_overview_en").title("敵情報概要（英語）").id("en_enemies_overview"),
            S.documentTypeListItem("enemy_bosses_en").title("ボス（英語）").id("en_enemies_boss"),
            S.documentTypeListItem("enemy_mid_en").title("中型（英語）").id("en_enemies_mid"),
            S.documentTypeListItem("enemy_small_en").title("小型（英語）").id("en_enemies_small"),
          ])
        ),
        S.listItem().title("その他（英語）").id("en_misc").child(
          S.list().title("その他（英語）").id("en_misc_list").items([
            S.documentTypeListItem("site_overview_en").title("Site Overview").id("en_site_overview"),
            S.documentTypeListItem("policy_index_en").title("Policies").id("en_policy_index"),
            S.documentTypeListItem("policy_terms_en").title("Terms").id("en_policy_terms"),
            S.documentTypeListItem("policy_privacy_en").title("Privacy Policy").id("en_policy_privacy"),
            S.documentTypeListItem("policy_ads_en").title("Advertising Policy").id("en_policy_ads"),
            S.documentTypeListItem("policy_disclaimer_en").title("Disclaimer").id("en_policy_disclaimer"),
            S.documentTypeListItem("policy_cookie_en").title("Cookie Policy").id("en_policy_cookie"),
            S.documentTypeListItem("policy_copyright_en").title("Copyright / DMCA").id("en_policy_copyright"),
            S.documentTypeListItem("policy_contact_en").title("Contact").id("en_policy_contact"),
          ])
        ),
      ])
    ),
  ]);

export default deskStructure;
