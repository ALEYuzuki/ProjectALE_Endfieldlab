import type { DamageBuff, DamageInput } from "@/src/domain/damage/calculateDamage";

export type DamagePreset = {
  key: string;
  labelJa: string;
  labelEn: string;
  input: DamageInput;
  // Legacy UI compatibility (Phase 1-C keeps UI unchanged)
  baseDamagePerHit: number;
  hitCount: number;
  buffs: DamageBuff[];
  enemyDefenseCoefficient: number;
  defenseReductionPercent: number;
  defenseIgnorePercent: number;
};

export const damagePresets: DamagePreset[] = [
  {
    key: "basic_no_buffs",
    labelJa: "基本（バフなし）",
    labelEn: "Basic no buffs",
    input: {
      atk: { characterAtk: 1000, weaponAtk: 500, atkPercentBonus: 0, flatAtkBonus: 0, primaryStat: 0, secondaryStat: 0, finalAtkManualOverride: null },
      skill: { skillMultiplier: 1.2, hitCount: 1, multiplierMode: "perHitMultiplier" },
      enemy: { enemyDefenseRank: "D", baseEnemyCoefficient: 0.5, enemyCoefficientRateBonus: 0, enemyCoefficientFlatBonus: 0, enemyDamageTaken: 0 },
      buckets: [],
      buffPolicy: { applyAtkPercentBucketInAtkPhase: true },
      roundingMode: "finalTotal",
      roundingFunction: "round"
    },
    baseDamagePerHit: 1500,
    hitCount: 1,
    buffs: [],
    enemyDefenseCoefficient: 0.5,
    defenseReductionPercent: 0,
    defenseIgnorePercent: 0
  },
  {
    key: "same_bucket_additive",
    labelJa: "同一bucket加算テスト",
    labelEn: "Same bucket additive test",
    input: {
      atk: { characterAtk: 900, weaponAtk: 400, atkPercentBonus: 0, flatAtkBonus: 0, primaryStat: 10, secondaryStat: 20, finalAtkManualOverride: null },
      skill: { skillMultiplier: 1.0, hitCount: 1, multiplierMode: "perHitMultiplier" },
      enemy: { enemyDefenseRank: "D", baseEnemyCoefficient: 0.5, enemyCoefficientRateBonus: 0, enemyCoefficientFlatBonus: 0, enemyDamageTaken: 0 },
      buckets: [
        { id: "db1", label: "Damage Bonus A", bucket: "damage_bonus", value: 0.2, enabled: true },
        { id: "db2", label: "Damage Bonus B", bucket: "damage_bonus", value: 0.15, enabled: true }
      ],
      buffPolicy: { applyAtkPercentBucketInAtkPhase: true },
      roundingMode: "finalTotal",
      roundingFunction: "round"
    },
    baseDamagePerHit: 1300,
    hitCount: 1,
    buffs: [
      { id: "db1", name: "Damage Bonus A", percent: 20, kind: "additive", enabled: true },
      { id: "db2", name: "Damage Bonus B", percent: 15, kind: "additive", enabled: true }
    ],
    enemyDefenseCoefficient: 0.5,
    defenseReductionPercent: 0,
    defenseIgnorePercent: 0
  },
  {
    key: "different_bucket_multiplicative",
    labelJa: "別bucket乗算テスト",
    labelEn: "Different bucket multiplicative test",
    input: {
      atk: { characterAtk: 950, weaponAtk: 450, atkPercentBonus: 0.1, flatAtkBonus: 50, primaryStat: 15, secondaryStat: 5, finalAtkManualOverride: null },
      skill: { skillMultiplier: 1.5, hitCount: 1, multiplierMode: "perHitMultiplier" },
      enemy: { enemyDefenseRank: "C", baseEnemyCoefficient: 0.6, enemyCoefficientRateBonus: 0, enemyCoefficientFlatBonus: 0, enemyDamageTaken: 0 },
      buckets: [
        { id: "dmg", label: "Damage Bonus", bucket: "damage_bonus", value: 0.2, enabled: true },
        { id: "elem", label: "Element Bonus", bucket: "elemental_damage_bonus", value: 0.25, enabled: true },
        { id: "skill", label: "Skill Bonus", bucket: "skill_damage_bonus", value: 0.1, enabled: true }
      ],
      buffPolicy: { applyAtkPercentBucketInAtkPhase: true },
      roundingMode: "finalTotal",
      roundingFunction: "round"
    },
    baseDamagePerHit: 1400,
    hitCount: 1,
    buffs: [
      { id: "dmg", name: "Damage Bonus", percent: 20, kind: "additive", enabled: true },
      { id: "elem", name: "Element Bonus", percent: 25, kind: "multiplicative", enabled: true }
    ],
    enemyDefenseCoefficient: 0.6,
    defenseReductionPercent: 0,
    defenseIgnorePercent: 0
  },
  {
    key: "defense_rank_b",
    labelJa: "敵係数ランクBテスト",
    labelEn: "Defense rank B test",
    input: {
      atk: { characterAtk: 1000, weaponAtk: 500, atkPercentBonus: 0, flatAtkBonus: 0, primaryStat: 0, secondaryStat: 0, finalAtkManualOverride: null },
      skill: { skillMultiplier: 1.0, hitCount: 1, multiplierMode: "perHitMultiplier" },
      enemy: { enemyDefenseRank: "B", baseEnemyCoefficient: 0.75, enemyCoefficientRateBonus: 0, enemyCoefficientFlatBonus: 0, enemyDamageTaken: 0 },
      buckets: [],
      buffPolicy: { applyAtkPercentBucketInAtkPhase: true },
      roundingMode: "finalTotal",
      roundingFunction: "round"
    },
    baseDamagePerHit: 1500,
    hitCount: 1,
    buffs: [],
    enemyDefenseCoefficient: 0.75,
    defenseReductionPercent: 0,
    defenseIgnorePercent: 0
  },
  {
    key: "defense_coefficient_rate_bonus",
    labelJa: "敵係数Rate補正テスト",
    labelEn: "Defense coefficient rate bonus test",
    input: {
      atk: { characterAtk: 1000, weaponAtk: 500, atkPercentBonus: 0, flatAtkBonus: 0, primaryStat: 0, secondaryStat: 0, finalAtkManualOverride: null },
      skill: { skillMultiplier: 1.0, hitCount: 1, multiplierMode: "perHitMultiplier" },
      enemy: { enemyDefenseRank: "C", baseEnemyCoefficient: 0.6, enemyCoefficientRateBonus: 0.2, enemyCoefficientFlatBonus: 0, enemyDamageTaken: 0 },
      buckets: [],
      buffPolicy: { applyAtkPercentBucketInAtkPhase: true },
      roundingMode: "finalTotal",
      roundingFunction: "round"
    },
    baseDamagePerHit: 1500,
    hitCount: 1,
    buffs: [],
    enemyDefenseCoefficient: 0.6,
    defenseReductionPercent: -20,
    defenseIgnorePercent: 0
  },
  {
    key: "defense_coefficient_flat_bonus",
    labelJa: "敵係数Flat補正テスト",
    labelEn: "Defense coefficient flat bonus test",
    input: {
      atk: { characterAtk: 1000, weaponAtk: 500, atkPercentBonus: 0, flatAtkBonus: 0, primaryStat: 0, secondaryStat: 0, finalAtkManualOverride: null },
      skill: { skillMultiplier: 1.0, hitCount: 1, multiplierMode: "perHitMultiplier" },
      enemy: { enemyDefenseRank: "C", baseEnemyCoefficient: 0.6, enemyCoefficientRateBonus: 0, enemyCoefficientFlatBonus: 0.1, enemyDamageTaken: 0 },
      buckets: [],
      buffPolicy: { applyAtkPercentBucketInAtkPhase: true },
      roundingMode: "finalTotal",
      roundingFunction: "round"
    },
    baseDamagePerHit: 1500,
    hitCount: 1,
    buffs: [],
    enemyDefenseCoefficient: 0.6,
    defenseReductionPercent: 0,
    defenseIgnorePercent: -10
  },
  {
    key: "multi_hit_per_hit_rounding",
    labelJa: "多段Hit（Hitごと丸め）",
    labelEn: "Multi-hit per-hit rounding test",
    input: {
      atk: { characterAtk: 877, weaponAtk: 321, atkPercentBonus: 0.08, flatAtkBonus: 17, primaryStat: 11, secondaryStat: 7, finalAtkManualOverride: null },
      skill: { skillMultiplier: 3.7, hitCount: 7, multiplierMode: "totalMultiplier" },
      enemy: { enemyDefenseRank: "D", baseEnemyCoefficient: 0.5, enemyCoefficientRateBonus: 0.05, enemyCoefficientFlatBonus: 0.02, enemyDamageTaken: 0.1 },
      buckets: [
        { id: "f1", label: "Final Mult", bucket: "final_multiplier", value: 0.18, enabled: true }
      ],
      buffPolicy: { applyAtkPercentBucketInAtkPhase: true },
      roundingMode: "perHit",
      roundingFunction: "round"
    },
    baseDamagePerHit: 1198,
    hitCount: 7,
    buffs: [{ id: "f1", name: "Final Mult", percent: 18, kind: "multiplicative", enabled: true }],
    enemyDefenseCoefficient: 0.5,
    defenseReductionPercent: -5,
    defenseIgnorePercent: -2
  },
  {
    key: "final_total_rounding",
    labelJa: "合計後丸めテスト",
    labelEn: "Final total rounding test",
    input: {
      atk: { characterAtk: 877, weaponAtk: 321, atkPercentBonus: 0.08, flatAtkBonus: 17, primaryStat: 11, secondaryStat: 7, finalAtkManualOverride: null },
      skill: { skillMultiplier: 3.7, hitCount: 7, multiplierMode: "totalMultiplier" },
      enemy: { enemyDefenseRank: "D", baseEnemyCoefficient: 0.5, enemyCoefficientRateBonus: 0.05, enemyCoefficientFlatBonus: 0.02, enemyDamageTaken: 0.1 },
      buckets: [
        { id: "f1", label: "Final Mult", bucket: "final_multiplier", value: 0.18, enabled: true }
      ],
      buffPolicy: { applyAtkPercentBucketInAtkPhase: true },
      roundingMode: "finalTotal",
      roundingFunction: "round"
    },
    baseDamagePerHit: 1198,
    hitCount: 7,
    buffs: [{ id: "f1", name: "Final Mult", percent: 18, kind: "multiplicative", enabled: true }],
    enemyDefenseCoefficient: 0.5,
    defenseReductionPercent: -5,
    defenseIgnorePercent: -2
  }
];
