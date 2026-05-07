import type { DamageBuff } from "@/src/domain/damage/calculateDamage";

export type DamagePreset = {
  key: string;
  labelJa: string;
  labelEn: string;
  baseDamagePerHit: number;
  hitCount: number;
  buffs: DamageBuff[];
  enemyDefenseCoefficient: number;
  defenseReductionPercent: number;
  defenseIgnorePercent: number;
};

export const damagePresets: DamagePreset[] = [
  {
    key: "burst",
    labelJa: "バースト想定",
    labelEn: "Burst setup",
    baseDamagePerHit: 1240,
    hitCount: 6,
    buffs: [
      { id: "atk-up", name: "ATK Up", percent: 35, kind: "additive", enabled: true },
      { id: "skill-up", name: "Skill DMG", percent: 20, kind: "additive", enabled: true },
      { id: "vuln", name: "Target Vuln", percent: 15, kind: "multiplicative", enabled: true }
    ],
    enemyDefenseCoefficient: 0.52,
    defenseReductionPercent: 20,
    defenseIgnorePercent: 10
  },
  {
    key: "sustain",
    labelJa: "継続火力想定",
    labelEn: "Sustain setup",
    baseDamagePerHit: 760,
    hitCount: 12,
    buffs: [
      { id: "atk-up", name: "ATK Up", percent: 25, kind: "additive", enabled: true },
      { id: "crit-window", name: "Window Buff", percent: 18, kind: "multiplicative", enabled: true }
    ],
    enemyDefenseCoefficient: 0.65,
    defenseReductionPercent: 10,
    defenseIgnorePercent: 5
  }
];
