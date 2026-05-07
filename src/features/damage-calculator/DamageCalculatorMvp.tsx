"use client";

import { useMemo, useState } from "react";
import {
  calculateDamage,
  type BuffBucketKey,
  type BucketEntry,
  type DamageInput,
  type EnemyDefenseRank,
  type MultiplierMode,
  type RoundingFunction,
  type RoundingMode
} from "@/src/domain/damage/calculateDamage";
import { damagePresets } from "@/src/data/damage/samplePresets";

type Props = { locale: string };

const ENEMY_RANK_BASE: Record<Exclude<EnemyDefenseRank, "CUSTOM">, number> = {
  D: 0.5,
  C: 0.6,
  B: 0.75
};

export default function DamageCalculatorMvp({ locale }: Props) {
  const isJa = locale === "ja";

  const [characterAtk, setCharacterAtk] = useState(1000);
  const [weaponAtk, setWeaponAtk] = useState(500);
  const [atkPercentBonus, setAtkPercentBonus] = useState(0);
  const [flatAtkBonus, setFlatAtkBonus] = useState(0);
  const [primaryStat, setPrimaryStat] = useState(0);
  const [secondaryStat, setSecondaryStat] = useState(0);
  const [manualFinalAtk, setManualFinalAtk] = useState("");

  const [skillMultiplier, setSkillMultiplier] = useState(1.2);
  const [hitCount, setHitCount] = useState(1);
  const [multiplierMode, setMultiplierMode] = useState<MultiplierMode>("perHitMultiplier");

  const [enemyDefenseRank, setEnemyDefenseRank] = useState<EnemyDefenseRank>("D");
  const [baseEnemyCoefficient, setBaseEnemyCoefficient] = useState(0.5);
  const [enemyCoefficientRateBonus, setEnemyCoefficientRateBonus] = useState(0);
  const [enemyCoefficientFlatBonus, setEnemyCoefficientFlatBonus] = useState(0);
  const [enemyDamageTaken, setEnemyDamageTaken] = useState(0);

  const [roundingMode, setRoundingMode] = useState<RoundingMode>("finalTotal");
  const [roundingFunction, setRoundingFunction] = useState<RoundingFunction>("round");

  const [applyAtkPercentBucketInAtkPhase, setApplyAtkPercentBucketInAtkPhase] = useState(true);

  const [buckets, setBuckets] = useState<BucketEntry[]>([
    { id: "dmg", label: "Damage Bonus", bucket: "damage_bonus", value: 0.2, enabled: true }
  ]);

  const resolvedBaseEnemyCoefficient = enemyDefenseRank === "CUSTOM"
    ? baseEnemyCoefficient
    : ENEMY_RANK_BASE[enemyDefenseRank];

  const input: DamageInput = {
    atk: {
      characterAtk,
      weaponAtk,
      atkPercentBonus,
      flatAtkBonus,
      primaryStat,
      secondaryStat,
      finalAtkManualOverride: manualFinalAtk.trim() === "" ? null : Number(manualFinalAtk)
    },
    skill: {
      skillMultiplier,
      hitCount,
      multiplierMode
    },
    enemy: {
      enemyDefenseRank,
      baseEnemyCoefficient: resolvedBaseEnemyCoefficient,
      enemyCoefficientRateBonus,
      enemyCoefficientFlatBonus,
      enemyDamageTaken
    },
    buckets,
    buffPolicy: { applyAtkPercentBucketInAtkPhase },
    roundingMode,
    roundingFunction
  };

  const result = useMemo(() => calculateDamage(input), [input]);

  return (
    <div className="mx-auto max-w-6xl p-6 text-zinc-100">
      <h1 className="mb-2 text-2xl font-semibold">{isJa ? "Endfield ダメージ計算機 v1" : "Endfield Damage Calculator v1"}</h1>
      <p className="mb-6 text-sm text-zinc-400">{isJa ? "ATK分解・bucket・敵係数・丸めを検証できます。" : "Validate ATK composition, buckets, enemy coefficients, and rounding behavior."}</p>

      <div className="grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 md:grid-cols-2">
        <NumberField label={isJa ? "キャラ基礎攻撃力" : "Character base ATK"} value={characterAtk} setValue={setCharacterAtk} />
        <NumberField label={isJa ? "武器攻撃力" : "Weapon ATK"} value={weaponAtk} setValue={setWeaponAtk} />
        <NumberField label={isJa ? "攻撃力%（0.2 = 20%）" : "ATK% bonus (0.2 = 20%)"} value={atkPercentBonus} setValue={setAtkPercentBonus} step={0.01} />
        <NumberField label={isJa ? "固定攻撃力" : "Flat ATK bonus"} value={flatAtkBonus} setValue={setFlatAtkBonus} />
        <NumberField label={isJa ? "メイン能力" : "Primary stat"} value={primaryStat} setValue={setPrimaryStat} />
        <NumberField label={isJa ? "サブ能力" : "Secondary stat"} value={secondaryStat} setValue={setSecondaryStat} />
        <TextNumberField label={isJa ? "最終攻撃力の直接入力（任意）" : "Final ATK manual override (optional)"} value={manualFinalAtk} setValue={setManualFinalAtk} />

        <NumberField label={isJa ? "スキル倍率" : "Skill multiplier"} value={skillMultiplier} setValue={setSkillMultiplier} step={0.01} />
        <NumberField label={isJa ? "Hit数" : "Hit count"} value={hitCount} setValue={setHitCount} />
        <SelectField
          label={isJa ? "倍率モード" : "Multiplier mode"}
          value={multiplierMode}
          setValue={(v) => setMultiplierMode(v as MultiplierMode)}
          options={[
            { value: "totalMultiplier", label: "totalMultiplier" },
            { value: "perHitMultiplier", label: "perHitMultiplier" }
          ]}
        />

        <SelectField
          label={isJa ? "敵防御ランク" : "Enemy defense rank"}
          value={enemyDefenseRank}
          setValue={(v) => setEnemyDefenseRank(v as EnemyDefenseRank)}
          options={[
            { value: "D", label: "D (0.50)" },
            { value: "C", label: "C (0.60)" },
            { value: "B", label: "B (0.75)" },
            { value: "CUSTOM", label: "CUSTOM" }
          ]}
        />

        {enemyDefenseRank === "CUSTOM" && (
          <NumberField label={isJa ? "敵係数（CUSTOM）" : "Base enemy coefficient (CUSTOM)"} value={baseEnemyCoefficient} setValue={setBaseEnemyCoefficient} step={0.01} />
        )}

        <NumberField label={isJa ? "敵係数補正 rate bonus" : "Enemy coefficient rate bonus"} value={enemyCoefficientRateBonus} setValue={setEnemyCoefficientRateBonus} step={0.01} />
        <NumberField label={isJa ? "敵係数補正 flat bonus" : "Enemy coefficient flat bonus"} value={enemyCoefficientFlatBonus} setValue={setEnemyCoefficientFlatBonus} step={0.01} />
        <NumberField label={isJa ? "敵被ダメ増加（0.2 = 20%）" : "Enemy damage taken (0.2 = 20%)"} value={enemyDamageTaken} setValue={setEnemyDamageTaken} step={0.01} />

        <SelectField
          label={isJa ? "丸め方式" : "Rounding mode"}
          value={roundingMode}
          setValue={(v) => setRoundingMode(v as RoundingMode)}
          options={[
            { value: "perHit", label: "perHit" },
            { value: "finalTotal", label: "finalTotal" }
          ]}
        />
        <SelectField
          label={isJa ? "丸め関数" : "Rounding function"}
          value={roundingFunction}
          setValue={(v) => setRoundingFunction(v as RoundingFunction)}
          options={[
            { value: "round", label: "round" },
            { value: "floor", label: "floor" },
            { value: "ceil", label: "ceil" }
          ]}
        />

        <div className="col-span-full rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={applyAtkPercentBucketInAtkPhase} onChange={(e) => setApplyAtkPercentBucketInAtkPhase(e.target.checked)} />
            {isJa ? "atk_percent bucket をATK計算側で適用" : "Apply atk_percent bucket in ATK phase"}
          </label>
        </div>

        <div className="col-span-full">
          <p className="mb-2 text-sm text-zinc-400">{isJa ? "バフbucket" : "Buff buckets"}</p>
          <div className="space-y-2">
            {buckets.map((bucket, idx) => (
              <div key={bucket.id} className="grid grid-cols-12 gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-2">
                <input className="col-span-3 rounded bg-zinc-800 px-2 py-1" value={bucket.label} onChange={(e) => updateBucket(idx, { label: e.target.value })} />
                <select className="col-span-4 rounded bg-zinc-800 px-2 py-1" value={bucket.bucket} onChange={(e) => updateBucket(idx, { bucket: e.target.value as BuffBucketKey })}>
                  <option value="atk_percent">atk_percent</option>
                  <option value="damage_bonus">damage_bonus</option>
                  <option value="elemental_damage_bonus">elemental_damage_bonus</option>
                  <option value="skill_damage_bonus">skill_damage_bonus</option>
                  <option value="enemy_damage_taken">enemy_damage_taken</option>
                  <option value="final_multiplier">final_multiplier</option>
                </select>
                <input className="col-span-3 rounded bg-zinc-800 px-2 py-1" type="number" step="0.01" value={bucket.value} onChange={(e) => updateBucket(idx, { value: Number(e.target.value) })} />
                <label className="col-span-2 flex items-center justify-center gap-1 text-xs"><input type="checkbox" checked={bucket.enabled} onChange={(e) => updateBucket(idx, { enabled: e.target.checked })} />ON</label>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <button className="rounded border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-800" onClick={() => setBuckets((prev) => [...prev, { id: crypto.randomUUID(), label: "New Bucket", bucket: "damage_bonus", value: 0.1, enabled: true }])}>{isJa ? "bucket追加" : "Add bucket"}</button>
            <button className="rounded border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-800" onClick={() => setBuckets((prev) => prev.slice(0, -1))}>{isJa ? "最後を削除" : "Remove last"}</button>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-emerald-700/30 bg-emerald-950/20 p-4">
        <p>{isJa ? "最終ダメージ" : "Final damage"}: <span className="text-2xl font-bold text-emerald-300">{result.finalTotalDamage.toLocaleString()}</span></p>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-zinc-300 md:grid-cols-2">
        <Stat label="finalAtk" value={result.finalAtk.toFixed(4)} />
        <Stat label="perHitMultiplier" value={result.perHitMultiplier.toFixed(4)} />
        <Stat label="selfBuffMultiplier" value={result.selfBuffMultiplier.toFixed(4)} />
        <Stat label="enemyCoefficientBeforeAdjustment" value={result.enemyCoefficientBeforeAdjustment.toFixed(4)} />
        <Stat label="enemyCoefficientAfterAdjustment" value={result.enemyCoefficientAfterAdjustment.toFixed(4)} />
        <Stat label="enemySideMultiplier" value={result.enemySideMultiplier.toFixed(4)} />
        <Stat label="rawPerHitDamage" value={result.rawPerHitDamage.toFixed(4)} />
        <Stat label="roundedPerHitDamage" value={result.roundedPerHitDamage.toFixed(4)} />
        <Stat label="rawTotalDamage" value={result.rawTotalDamage.toFixed(4)} />
        <Stat label="finalTotalDamage" value={result.finalTotalDamage.toFixed(4)} />
      </div>

      <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 text-xs text-zinc-300 whitespace-pre-wrap">
        <div className="mb-1 text-zinc-400">formulaText</div>
        {result.formulaText}
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-800 p-4">
        <p className="mb-2 text-sm text-zinc-400">{isJa ? "サンプルプリセット" : "Sample presets"}</p>
        <div className="flex flex-wrap gap-2">
          {damagePresets.map((preset) => (
            <button key={preset.key} className="rounded border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm hover:bg-zinc-800" onClick={() => applyPreset(preset.input)}>{isJa ? preset.labelJa : preset.labelEn}</button>
          ))}
        </div>
      </div>
    </div>
  );

  function updateBucket(index: number, partial: Partial<BucketEntry>) {
    setBuckets((prev) => prev.map((b, i) => (i === index ? { ...b, ...partial } : b)));
  }

  function applyPreset(next: DamageInput) {
    setCharacterAtk(next.atk.characterAtk);
    setWeaponAtk(next.atk.weaponAtk);
    setAtkPercentBonus(next.atk.atkPercentBonus);
    setFlatAtkBonus(next.atk.flatAtkBonus);
    setPrimaryStat(next.atk.primaryStat);
    setSecondaryStat(next.atk.secondaryStat);
    setManualFinalAtk(next.atk.finalAtkManualOverride == null ? "" : String(next.atk.finalAtkManualOverride));

    setSkillMultiplier(next.skill.skillMultiplier);
    setHitCount(next.skill.hitCount);
    setMultiplierMode(next.skill.multiplierMode);

    setEnemyDefenseRank(next.enemy.enemyDefenseRank);
    setBaseEnemyCoefficient(next.enemy.baseEnemyCoefficient);
    setEnemyCoefficientRateBonus(next.enemy.enemyCoefficientRateBonus);
    setEnemyCoefficientFlatBonus(next.enemy.enemyCoefficientFlatBonus);
    setEnemyDamageTaken(next.enemy.enemyDamageTaken);

    setBuckets(next.buckets);
    setApplyAtkPercentBucketInAtkPhase(next.buffPolicy?.applyAtkPercentBucketInAtkPhase ?? true);
    setRoundingMode(next.roundingMode ?? "finalTotal");
    setRoundingFunction(next.roundingFunction ?? "round");
  }
}

function NumberField({ label, value, setValue, step = 1 }: { label: string; value: number; setValue: (v: number) => void; step?: number }) {
  return (
    <label className="text-sm">
      <div className="mb-1 text-zinc-400">{label}</div>
      <input className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2" type="number" step={step} value={value} onChange={(e) => setValue(Number(e.target.value))} />
    </label>
  );
}

function TextNumberField({ label, value, setValue }: { label: string; value: string; setValue: (v: string) => void }) {
  return (
    <label className="text-sm md:col-span-2">
      <div className="mb-1 text-zinc-400">{label}</div>
      <input className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2" type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="(optional)" />
    </label>
  );
}

function SelectField({ label, value, setValue, options }: { label: string; value: string; setValue: (v: string) => void; options: Array<{ value: string; label: string }> }) {
  return (
    <label className="text-sm">
      <div className="mb-1 text-zinc-400">{label}</div>
      <select className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2" value={value} onChange={(e) => setValue(e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded border border-zinc-800 bg-zinc-900/50 p-2"><span className="text-zinc-500">{label}: </span>{value}</div>;
}
