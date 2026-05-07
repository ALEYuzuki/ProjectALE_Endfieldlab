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

export type DamageInput = {
  baseDamagePerHit: number;
  hitCount: number;
  roundPerHit: boolean;
  roundTotal: boolean;
  buffs: DamageBuff[];
  defense: DefenseInput;
};

export type DamageResult = {
  additiveMultiplier: number;
  multiplicativeMultiplier: number;
  defenseMultiplier: number;
  perHitDamageBeforeRounding: number;
  perHitDamageAfterRounding: number;
  totalDamageBeforeRounding: number;
  totalDamageAfterRounding: number;
};

const toRatio = (percent: number) => percent / 100;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function calculateDamage(input: DamageInput): DamageResult {
  const additive = input.buffs
    .filter((b) => b.enabled && b.kind === "additive")
    .reduce((sum, b) => sum + toRatio(b.percent), 0);

  const multiplicative = input.buffs
    .filter((b) => b.enabled && b.kind === "multiplicative")
    .reduce((product, b) => product * (1 + toRatio(b.percent)), 1);

  const effectiveDefenseCoef = input.defense.enemyDefenseCoefficient *
    (1 - clamp01(toRatio(input.defense.defenseReductionPercent))) *
    (1 - clamp01(toRatio(input.defense.defenseIgnorePercent)));

  const defenseMultiplier = 1 / (1 + Math.max(0, effectiveDefenseCoef));

  const additiveMultiplier = 1 + additive;
  const perHitRaw = input.baseDamagePerHit * additiveMultiplier * multiplicative * defenseMultiplier;
  const perHitRounded = input.roundPerHit ? Math.floor(perHitRaw) : perHitRaw;

  const totalRaw = perHitRounded * Math.max(1, Math.floor(input.hitCount));
  const totalRounded = input.roundTotal ? Math.floor(totalRaw) : totalRaw;

  return {
    additiveMultiplier,
    multiplicativeMultiplier: multiplicative,
    defenseMultiplier,
    perHitDamageBeforeRounding: perHitRaw,
    perHitDamageAfterRounding: perHitRounded,
    totalDamageBeforeRounding: totalRaw,
    totalDamageAfterRounding: totalRounded
  };
}
