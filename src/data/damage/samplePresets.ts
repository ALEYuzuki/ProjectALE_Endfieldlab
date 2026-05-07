import type { EndfieldDamageInput } from "@/src/domain/damage/calculateDamage";

export type DamagePreset = { key: string; labelJa: string; labelEn: string; input: EndfieldDamageInput };

const base: EndfieldDamageInput = {
  characterBaseAtk: 700, weaponAtk: 300, armorAtkFlat: 100, otherAtkFlat: 0, atkPercentBonus: 0, finalAtkManualOverride: null,
  skillMultiplier: 120, hitCount: 1, multiplierSplitMode: "perHitMultiplier",
  enemyDefenseRank: "D", defenseRateReduction: 0, defenseIgnoreFlat: 0,
  buffs: [], roundingMode: "perHit"
};

export const damagePresets: DamagePreset[] = [
  { key: "basic", labelJa: "Basic no buffs", labelEn: "Basic no buffs", input: { ...base } },
  { key: "same-bucket", labelJa: "Same bucket additive test", labelEn: "Same bucket additive test", input: { ...base, buffs: [ { id: "a", name: "d1", bucket: "damage_bonus", value: 20, enabled: true }, { id: "b", name: "d2", bucket: "damage_bonus", value: 30, enabled: true } ] } },
  { key: "diff-bucket", labelJa: "Different bucket multiplicative test", labelEn: "Different bucket multiplicative test", input: { ...base, buffs: [ { id: "a", name: "dmg", bucket: "damage_bonus", value: 20, enabled: true }, { id: "b", name: "taken", bucket: "enemy_damage_taken", value: 30, enabled: true } ] } },
  { key: "rank-b", labelJa: "Defense rank B test", labelEn: "Defense rank B test", input: { ...base, enemyDefenseRank: "B" } },
  { key: "def-red", labelJa: "Defense reduction test", labelEn: "Defense reduction test", input: { ...base, enemyDefenseRank: "B", defenseRateReduction: 0.2 } },
  { key: "def-ignore", labelJa: "Defense ignore test", labelEn: "Defense ignore test", input: { ...base, enemyDefenseRank: "B", defenseIgnoreFlat: 0.1 } },
  { key: "hit-round", labelJa: "Multi-hit per-hit rounding test", labelEn: "Multi-hit per-hit rounding test", input: { ...base, skillMultiplier: 46, hitCount: 6, multiplierSplitMode: "totalMultiplier", roundingMode: "perHit" } },
  { key: "final-round", labelJa: "Final total rounding test", labelEn: "Final total rounding test", input: { ...base, skillMultiplier: 46, hitCount: 6, multiplierSplitMode: "totalMultiplier", roundingMode: "finalTotal" } }
];
