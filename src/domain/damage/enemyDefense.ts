export const ENEMY_DEFENSE_RATES = {
  D: 0.5,
  C: 0.6,
  B: 0.75
} as const;

export type EnemyDefenseRank = keyof typeof ENEMY_DEFENSE_RATES;
