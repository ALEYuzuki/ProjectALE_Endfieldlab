import { ENEMY_DEFENSE_RATES, type EnemyDefenseRank } from "@/src/domain/damage/enemyDefense";

export type MultiplierSplitMode = "totalMultiplier" | "perHitMultiplier";
export type RoundingMode = "perHit" | "finalTotal";
export type BuffBucket = "atk_percent" | "damage_bonus" | "elemental_damage_bonus" | "skill_damage_bonus" | "enemy_damage_taken" | "arts_intensity" | "final_multiplier";
export type DamageBuff = { id: string; name: string; bucket: BuffBucket; value: number; enabled: boolean };

export type EndfieldDamageInput = {
  characterBaseAtk: number; weaponAtk: number; armorAtkFlat: number; otherAtkFlat: number; atkPercentBonus: number; finalAtkManualOverride?: number | null;
  skillMultiplier: number; hitCount: number; multiplierSplitMode: MultiplierSplitMode;
  enemyDefenseRank: EnemyDefenseRank; defenseRateReduction: number; defenseIgnoreFlat: number;
  buffs: DamageBuff[]; roundingMode: RoundingMode;
};

export type EndfieldDamageResult = {
  displayedAtk: number; perHitSkillMultiplier: number; hitCount: number; selfBuffMultiplier: number;
  enemyDefenseRank: EnemyDefenseRank; baseDefenseRate: number; afterRateReductionDefenseRate: number; afterFlatIgnoreDefenseRate: number;
  enemyDefenseMultiplier: number; enemySideMultiplier: number; perHitDamage: number; totalDamage: number; roundingMode: RoundingMode; formula: string;
};

const roundValue = (v: number) => Math.round(v);
const toRatio = (v: number) => v / 100;
const clampMin0 = (v: number) => Math.max(0, v);

export function calculateDamage(input: EndfieldDamageInput): EndfieldDamageResult {
  const manual = input.finalAtkManualOverride;
  const displayedAtk = typeof manual === "number" && Number.isFinite(manual)
    ? manual
    : (input.characterBaseAtk + input.weaponAtk + input.armorAtkFlat + input.otherAtkFlat) * (1 + toRatio(input.atkPercentBonus));

  const hitCount = Math.max(1, Math.floor(input.hitCount));
  const perHitSkillMultiplier = input.multiplierSplitMode === "totalMultiplier"
    ? toRatio(input.skillMultiplier) / hitCount
    : toRatio(input.skillMultiplier);

  const sumBuckets: Record<BuffBucket, number> = { atk_percent: 0, damage_bonus: 0, elemental_damage_bonus: 0, skill_damage_bonus: 0, enemy_damage_taken: 0, arts_intensity: 0, final_multiplier: 0 };
  input.buffs.filter((b) => b.enabled).forEach((b) => { sumBuckets[b.bucket] += toRatio(b.value); });

  const atkBucketMultiplier = 1 + sumBuckets.atk_percent;
  const selfBuffMultiplier = atkBucketMultiplier * (1 + sumBuckets.damage_bonus) * (1 + sumBuckets.elemental_damage_bonus) * (1 + sumBuckets.skill_damage_bonus) * (1 + sumBuckets.arts_intensity) * (1 + sumBuckets.final_multiplier);

  const baseDefenseRate = ENEMY_DEFENSE_RATES[input.enemyDefenseRank];
  const afterRateReductionDefenseRate = baseDefenseRate * (1 - input.defenseRateReduction);
  const afterFlatIgnoreDefenseRate = clampMin0(afterRateReductionDefenseRate - input.defenseIgnoreFlat);
  const enemyDefenseMultiplier = 1 - afterFlatIgnoreDefenseRate;
  const enemySideMultiplier = enemyDefenseMultiplier * (1 + sumBuckets.enemy_damage_taken);

  const perHitRaw = displayedAtk * perHitSkillMultiplier * selfBuffMultiplier * enemySideMultiplier;
  const totalRaw = perHitRaw * hitCount;

  const perHitDamage = input.roundingMode === "perHit" ? roundValue(perHitRaw) : perHitRaw;
  const totalDamage = input.roundingMode === "perHit" ? perHitDamage * hitCount : roundValue(totalRaw);

  return {
    displayedAtk, perHitSkillMultiplier, hitCount, selfBuffMultiplier,
    enemyDefenseRank: input.enemyDefenseRank, baseDefenseRate, afterRateReductionDefenseRate, afterFlatIgnoreDefenseRate,
    enemyDefenseMultiplier, enemySideMultiplier, perHitDamage, totalDamage, roundingMode: input.roundingMode,
    formula: `Round(${displayedAtk.toFixed(2)} × ${perHitSkillMultiplier.toFixed(4)} × ${selfBuffMultiplier.toFixed(4)} × ${enemySideMultiplier.toFixed(4)})`
  };
}
