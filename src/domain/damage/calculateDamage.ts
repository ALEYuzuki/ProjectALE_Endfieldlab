export type EnemyDefenseRank = "D" | "C" | "B" | "CUSTOM";

export type MultiplierMode = "totalMultiplier" | "perHitMultiplier";

export type RoundingMode = "perHit" | "finalTotal";

export type RoundingFunction = "round" | "floor" | "ceil";

export type BuffBucketKey =
  | "atk_percent"
  | "damage_bonus"
  | "elemental_damage_bonus"
  | "skill_damage_bonus"
  | "enemy_damage_taken"
  | "final_multiplier";

export type BucketEntry = {
  id: string;
  label: string;
  bucket: BuffBucketKey;
  value: number;
  enabled: boolean;
};

export type AtkInput = {
  characterAtk: number;
  weaponAtk: number;
  atkPercentBonus: number;
  flatAtkBonus: number;
  primaryStat: number;
  secondaryStat: number;
  finalAtkManualOverride?: number | null;
};

export type SkillInput = {
  skillMultiplier: number;
  hitCount: number;
  multiplierMode: MultiplierMode;
};

export type EnemyCoefficientInput = {
  enemyDefenseRank: EnemyDefenseRank;
  baseEnemyCoefficient: number;
  enemyCoefficientRateBonus: number;
  enemyCoefficientFlatBonus: number;
  enemyDamageTaken: number;
};

export type BuffPolicy = {
  applyAtkPercentBucketInAtkPhase: boolean;
};

export type DamageInput = {
  atk: AtkInput;
  skill: SkillInput;
  enemy: EnemyCoefficientInput;
  buckets: BucketEntry[];
  buffPolicy?: Partial<BuffPolicy>;
  roundingMode?: RoundingMode;
  roundingFunction?: RoundingFunction;
};

// Legacy MVP compatibility
export type DamageBuff = {
  id: string;
  name: string;
  percent: number;
  kind: "additive" | "multiplicative";
  enabled: boolean;
};

export type DefenseInput = {
  enemyDefenseCoefficient: number;
  defenseReductionPercent: number;
  defenseIgnorePercent: number;
};

export type LegacyDamageInput = {
  baseDamagePerHit: number;
  hitCount: number;
  roundPerHit: boolean;
  roundTotal: boolean;
  buffs: DamageBuff[];
  defense: DefenseInput;
};

export type DamageResult = {
  // v1
  finalAtk: number;
  perHitMultiplier: number;
  hitCount: number;
  selfBuffMultiplier: number;
  enemyCoefficientBeforeAdjustment: number;
  enemyCoefficientAfterAdjustment: number;
  enemySideMultiplier: number;
  rawPerHitDamage: number;
  roundedPerHitDamage: number;
  rawTotalDamage: number;
  finalTotalDamage: number;
  roundingMode: RoundingMode;
  roundingFunction: RoundingFunction;
  formulaText: string;

  // legacy UI compatibility fields
  additiveMultiplier: number;
  multiplicativeMultiplier: number;
  defenseMultiplier: number;
  perHitDamageBeforeRounding: number;
  perHitDamageAfterRounding: number;
  totalDamageBeforeRounding: number;
  totalDamageAfterRounding: number;
};

const DEFAULT_ENEMY_COEFFICIENT_BY_RANK: Record<Exclude<EnemyDefenseRank, "CUSTOM">, number> = {
  D: 0.5,
  C: 0.6,
  B: 0.75
};

function toRatioFromPercent(percent: number): number {
  return percent / 100;
}

function resolveRoundingFunction(roundingFunction: RoundingFunction): (value: number) => number {
  switch (roundingFunction) {
    case "floor":
      return Math.floor;
    case "ceil":
      return Math.ceil;
    default:
      return Math.round;
  }
}

function sumBucketValues(buckets: BucketEntry[], key: BuffBucketKey): number {
  return buckets.filter((b) => b.enabled && b.bucket === key).reduce((sum, b) => sum + b.value, 0);
}

function multiplyBuckets(buckets: BucketEntry[], keys: BuffBucketKey[]): number {
  return keys.reduce((product, key) => product * (1 + sumBucketValues(buckets, key)), 1);
}

function buildFormulaText(result: Omit<DamageResult, "formulaText">): string {
  return [
    `rawPerHit = finalAtk(${result.finalAtk.toFixed(4)})`,
    `* perHitMultiplier(${result.perHitMultiplier.toFixed(4)})`,
    `* selfBuffMultiplier(${result.selfBuffMultiplier.toFixed(4)})`,
    `* enemySideMultiplier(${result.enemySideMultiplier.toFixed(4)})`,
    `=> ${result.rawPerHitDamage.toFixed(4)}`,
    `rawTotal = rawPerHit * hitCount(${result.hitCount}) => ${result.rawTotalDamage.toFixed(4)}`,
    `rounding: ${result.roundingFunction} @ ${result.roundingMode} => finalTotal(${result.finalTotalDamage.toFixed(4)})`
  ].join("\n");
}

function normalizeInput(input: DamageInput | LegacyDamageInput): DamageInput {
  if ("atk" in input) {
    return {
      ...input,
      buffPolicy: {
        applyAtkPercentBucketInAtkPhase: input.buffPolicy?.applyAtkPercentBucketInAtkPhase ?? true
      },
      roundingMode: input.roundingMode ?? "finalTotal",
      roundingFunction: input.roundingFunction ?? "round"
    };
  }

  const roundMode: RoundingMode = input.roundPerHit ? "perHit" : "finalTotal";

  const buckets: BucketEntry[] = input.buffs.map((buff) => ({
    id: buff.id,
    label: buff.name,
    bucket: buff.kind === "additive" ? "damage_bonus" : "final_multiplier",
    value: toRatioFromPercent(buff.percent),
    enabled: buff.enabled
  }));

  const legacyPerHit = input.baseDamagePerHit;
  const hitCount = Math.max(1, Math.floor(input.hitCount));

  return {
    atk: {
      characterAtk: legacyPerHit,
      weaponAtk: 0,
      atkPercentBonus: 0,
      flatAtkBonus: 0,
      primaryStat: 0,
      secondaryStat: 0,
      finalAtkManualOverride: legacyPerHit
    },
    skill: {
      skillMultiplier: 1,
      hitCount,
      multiplierMode: "perHitMultiplier"
    },
    enemy: {
      enemyDefenseRank: "CUSTOM",
      baseEnemyCoefficient: input.defense.enemyDefenseCoefficient,
      enemyCoefficientRateBonus: -toRatioFromPercent(input.defense.defenseReductionPercent),
      enemyCoefficientFlatBonus: -toRatioFromPercent(input.defense.defenseIgnorePercent),
      enemyDamageTaken: 0
    },
    buckets,
    buffPolicy: {
      applyAtkPercentBucketInAtkPhase: true
    },
    roundingMode: input.roundTotal ? "finalTotal" : roundMode,
    roundingFunction: "round"
  };
}

export function calculateDamage(input: DamageInput | LegacyDamageInput): DamageResult {
  const normalized = normalizeInput(input);

  const hitCount = Math.max(1, Math.floor(normalized.skill.hitCount));
  const roundingMode = normalized.roundingMode ?? "finalTotal";
  const roundingFunction = normalized.roundingFunction ?? "round";
  const applyRound = resolveRoundingFunction(roundingFunction);
  const applyAtkPercentBucketInAtkPhase = normalized.buffPolicy?.applyAtkPercentBucketInAtkPhase ?? true;

  const atkPercentBucket = sumBucketValues(normalized.buckets, "atk_percent");
  const atkPercentTotal = normalized.atk.atkPercentBonus + (applyAtkPercentBucketInAtkPhase ? atkPercentBucket : 0);

  const baseFinalAtk = (
    (normalized.atk.characterAtk + normalized.atk.weaponAtk) * (1 + atkPercentTotal) + normalized.atk.flatAtkBonus
  ) * (1 + 0.005 * normalized.atk.primaryStat + 0.002 * normalized.atk.secondaryStat);

  const finalAtk = normalized.atk.finalAtkManualOverride ?? baseFinalAtk;

  const perHitMultiplier = normalized.skill.multiplierMode === "totalMultiplier"
    ? normalized.skill.skillMultiplier / hitCount
    : normalized.skill.skillMultiplier;

  const selfBucketKeys: BuffBucketKey[] = ["damage_bonus", "elemental_damage_bonus", "skill_damage_bonus", "final_multiplier"];
  if (!applyAtkPercentBucketInAtkPhase) {
    selfBucketKeys.unshift("atk_percent");
  }
  const selfBuffMultiplier = multiplyBuckets(normalized.buckets, selfBucketKeys);

  const enemyDamageTakenFromBuckets = sumBucketValues(normalized.buckets, "enemy_damage_taken");

  const rankDefault = normalized.enemy.enemyDefenseRank !== "CUSTOM"
    ? DEFAULT_ENEMY_COEFFICIENT_BY_RANK[normalized.enemy.enemyDefenseRank]
    : normalized.enemy.baseEnemyCoefficient;

  const enemyCoefficientBeforeAdjustment = normalized.enemy.baseEnemyCoefficient ?? rankDefault;
  const enemyCoefficientAfterAdjustment =
    enemyCoefficientBeforeAdjustment * (1 + normalized.enemy.enemyCoefficientRateBonus)
    + normalized.enemy.enemyCoefficientFlatBonus;

  const totalEnemyDamageTaken = normalized.enemy.enemyDamageTaken + enemyDamageTakenFromBuckets;
  const enemySideMultiplier = enemyCoefficientAfterAdjustment * (1 + totalEnemyDamageTaken);

  const rawPerHitDamage = finalAtk * perHitMultiplier * selfBuffMultiplier * enemySideMultiplier;
  const rawTotalDamage = rawPerHitDamage * hitCount;

  const roundedPerHitDamage = roundingMode === "perHit" ? applyRound(rawPerHitDamage) : rawPerHitDamage;
  const finalTotalDamage = roundingMode === "perHit"
    ? roundedPerHitDamage * hitCount
    : applyRound(rawTotalDamage);

  const resultWithoutFormula: Omit<DamageResult, "formulaText"> = {
    finalAtk,
    perHitMultiplier,
    hitCount,
    selfBuffMultiplier,
    enemyCoefficientBeforeAdjustment,
    enemyCoefficientAfterAdjustment,
    enemySideMultiplier,
    rawPerHitDamage,
    roundedPerHitDamage,
    rawTotalDamage,
    finalTotalDamage,
    roundingMode,
    roundingFunction,
    additiveMultiplier: selfBuffMultiplier,
    multiplicativeMultiplier: 1,
    defenseMultiplier: enemySideMultiplier,
    perHitDamageBeforeRounding: rawPerHitDamage,
    perHitDamageAfterRounding: roundedPerHitDamage,
    totalDamageBeforeRounding: rawTotalDamage,
    totalDamageAfterRounding: finalTotalDamage
  };

  return {
    ...resultWithoutFormula,
    formulaText: buildFormulaText(resultWithoutFormula)
  };
}
