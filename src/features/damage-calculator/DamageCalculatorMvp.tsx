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
const FIELD_CLASS = "border border-slate-600 bg-[#07111a] text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none";

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
    <div className="mx-auto max-w-[1500px] px-4 py-6 text-slate-100 md:px-8">
      <div className="border border-slate-600 bg-[#03080f] shadow-[0_0_0_1px_rgba(125,147,173,0.12)_inset]">
        <header className="border-b border-slate-700 px-4 py-4 md:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Research UI / Endfield v1</p>
              <h1 className="mt-1 text-xl font-semibold tracking-wide md:text-2xl">ENDFIELD DAMAGE CALCULATOR</h1>
              <p className="mt-1 text-sm text-slate-400">
                {isJa ? "エンドフィールド向けダメージ計算式検証パネル" : "Endfield-oriented damage formula validation panel"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-slate-300">
              {["Chara", "Skill", "Enemy", "Buff", "Result"].map((tab) => (
                <span key={tab} className="border border-slate-600 bg-[#0b1623] px-3 py-1">{tab}</span>
              ))}
            </div>
          </div>
        </header>

        <section className="border-b border-slate-700 px-4 py-4 md:px-6">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-400">Preset Loader</p>
          <div className="flex flex-wrap gap-2">
            {damagePresets.map((preset) => (
              <button
                key={preset.key}
                className="border border-slate-600 bg-[#0b1623] px-3 py-1 text-xs text-slate-200 transition hover:border-cyan-400 hover:text-cyan-200"
                onClick={() => applyPreset(preset.input)}
              >
                {isJa ? preset.labelJa : preset.labelEn}
              </button>
            ))}
          </div>
        </section>

        <main className="grid gap-4 p-4 md:grid-cols-12 md:p-6">
          <Panel className="md:col-span-4" title="Character / Core Status" subtitle="ATK composition and base profile">
            <div className="grid gap-3">
              <NumberField label={isJa ? "キャラ基礎攻撃力" : "Character base ATK"} value={characterAtk} setValue={setCharacterAtk} />
              <NumberField label={isJa ? "武器攻撃力" : "Weapon ATK"} value={weaponAtk} setValue={setWeaponAtk} />
              <NumberField label={isJa ? "攻撃力%（0.2 = 20%）" : "ATK% bonus (0.2 = 20%)"} value={atkPercentBonus} setValue={setAtkPercentBonus} step={0.01} />
              <NumberField label={isJa ? "固定攻撃力" : "Flat ATK bonus"} value={flatAtkBonus} setValue={setFlatAtkBonus} />
              <NumberField label={isJa ? "メイン能力" : "Primary stat"} value={primaryStat} setValue={setPrimaryStat} />
              <NumberField label={isJa ? "サブ能力" : "Secondary stat"} value={secondaryStat} setValue={setSecondaryStat} />
              <TextNumberField label={isJa ? "最終攻撃力直接入力（任意）" : "Final ATK manual override (optional)"} value={manualFinalAtk} setValue={setManualFinalAtk} />
            </div>
          </Panel>

          <Panel className="md:col-span-4" title="Skill / Damage Setup" subtitle="Hit behavior and rounding strategy">
            <div className="grid gap-3">
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
            </div>
          </Panel>

          <Panel className="md:col-span-4" title="Enemy Status" subtitle="Defense model and enemy-side modifiers">
            <div className="grid gap-3">
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

              <label className="border border-slate-700 bg-slate-900/70 p-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={applyAtkPercentBucketInAtkPhase} onChange={(e) => setApplyAtkPercentBucketInAtkPhase(e.target.checked)} />
                  <span>{isJa ? "atk_percent bucket をATK計算側で適用" : "Apply atk_percent bucket in ATK phase"}</span>
                </div>
              </label>

            </div>
          </Panel>

          <Panel className="md:col-span-12" title="Buff Status" subtitle="Bucket table for additive / multiplicative adjustments">
            <div className="overflow-x-auto border border-slate-700">
              <div className="min-w-[760px]">
                <div className="grid grid-cols-12 border-b border-slate-700 bg-[#091423] px-2 py-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  <div className="col-span-1 text-center">ON</div>
                  <div className="col-span-3">Name</div>
                  <div className="col-span-4">Bucket</div>
                  <div className="col-span-3">Value</div>
                  <div className="col-span-1 text-center">Remove</div>
                </div>
                {buckets.map((bucket, idx) => (
                  <div key={bucket.id} className="grid grid-cols-12 items-center gap-2 border-b border-slate-800 bg-[#050d18] px-2 py-2 last:border-b-0">
                    <label className="col-span-1 flex items-center justify-center">
                      <input type="checkbox" checked={bucket.enabled} onChange={(e) => updateBucket(idx, { enabled: e.target.checked })} />
                    </label>
                    <input className={`col-span-3 ${FIELD_CLASS} px-2 py-1 text-xs`} value={bucket.label} onChange={(e) => updateBucket(idx, { label: e.target.value })} />
                    <select className={`col-span-4 ${FIELD_CLASS} px-2 py-1 text-xs`} value={bucket.bucket} onChange={(e) => updateBucket(idx, { bucket: e.target.value as BuffBucketKey })}>
                      <option className="bg-slate-900 text-slate-100" value="atk_percent">atk_percent</option>
                      <option className="bg-slate-900 text-slate-100" value="damage_bonus">damage_bonus</option>
                      <option className="bg-slate-900 text-slate-100" value="elemental_damage_bonus">elemental_damage_bonus</option>
                      <option className="bg-slate-900 text-slate-100" value="skill_damage_bonus">skill_damage_bonus</option>
                      <option className="bg-slate-900 text-slate-100" value="enemy_damage_taken">enemy_damage_taken</option>
                      <option className="bg-slate-900 text-slate-100" value="final_multiplier">final_multiplier</option>
                    </select>
                    <input className={`col-span-3 ${FIELD_CLASS} px-2 py-1 text-xs`} type="number" step="0.01" value={bucket.value} onChange={(e) => updateBucket(idx, { value: Number(e.target.value) })} />
                    <button className="col-span-1 border border-slate-600 bg-[#0b1623] px-1 py-1 text-[11px] text-slate-200 hover:border-rose-400 hover:text-rose-200" onClick={() => setBuckets((prev) => prev.filter((_, i) => i !== idx))}>×</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-2 flex gap-2">
              <button className="border border-slate-600 bg-[#0b1623] px-2 py-1 text-xs hover:border-cyan-400" onClick={() => setBuckets((prev) => [...prev, { id: crypto.randomUUID(), label: "New Bucket", bucket: "damage_bonus", value: 0.1, enabled: true }])}>{isJa ? "bucket追加" : "Add bucket"}</button>
            </div>
          </Panel>
        </main>

        <section className="border-t border-slate-700 px-4 py-4 md:px-6 md:py-5">
          <p className="mb-3 text-xs uppercase tracking-[0.22em] text-slate-400">Result / Breakdown</p>
          <div className="mb-4 border border-emerald-700/50 bg-emerald-900/20 p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Final Total Damage</p>
            <p className="text-3xl font-bold text-emerald-200">{result.finalTotalDamage.toLocaleString()}</p>
          </div>
          <div className="grid gap-2 text-sm md:grid-cols-2 lg:grid-cols-5">
            <Stat label="FINAL TOTAL DAMAGE" value={result.finalTotalDamage.toFixed(4)} />
            <Stat label="PER HIT DAMAGE" value={result.roundedPerHitDamage.toFixed(4)} />
            <Stat label="FINAL ATK" value={result.finalAtk.toFixed(4)} />
            <Stat label="ENEMY COEFFICIENT" value={result.enemyCoefficientAfterAdjustment.toFixed(4)} />
            <Stat label="SELF BUFF" value={result.selfBuffMultiplier.toFixed(4)} />
          </div>
          <div className="mt-3 border border-slate-700 bg-slate-900/60 p-3 text-xs text-slate-300 whitespace-pre-wrap">
            <div className="mb-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">formulaText</div>
            {result.formulaText}
          </div>
        </section>
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

function Panel({ title, subtitle, className = "", children }: { title: string; subtitle: string; className?: string; children: React.ReactNode }) {
  return (
    <section className={`border border-slate-700 bg-[#050d18] p-3 ${className}`}>
      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{title}</p>
      <p className="mb-3 mt-1 text-xs text-slate-500">{subtitle}</p>
      {children}
    </section>
  );
}

function NumberField({ label, value, setValue, step = 1 }: { label: string; value: number; setValue: (v: number) => void; step?: number }) {
  return (
    <label className="text-xs">
      <div className="mb-1 text-slate-400">{label}</div>
      <input className={`${FIELD_CLASS} w-full px-2 py-1.5 text-sm`} type="number" step={step} value={value} onChange={(e) => setValue(Number(e.target.value))} />
    </label>
  );
}

function TextNumberField({ label, value, setValue }: { label: string; value: string; setValue: (v: string) => void }) {
  return (
    <label className="text-xs">
      <div className="mb-1 text-slate-400">{label}</div>
      <input className={`${FIELD_CLASS} w-full px-2 py-1.5 text-sm`} type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="(optional)" />
    </label>
  );
}

function SelectField({ label, value, setValue, options }: { label: string; value: string; setValue: (v: string) => void; options: Array<{ value: string; label: string }> }) {
  return (
    <label className="text-xs">
      <div className="mb-1 text-slate-400">{label}</div>
      <select className={`${FIELD_CLASS} w-full px-2 py-1.5 text-sm`} value={value} onChange={(e) => setValue(e.target.value)}>
        {options.map((o) => <option className="bg-slate-900 text-slate-100" key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-slate-700 bg-[#081321] px-3 py-2">
      <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{label}</div>
      <div className="mt-1 text-base font-semibold text-slate-100">{value}</div>
    </div>
  );
}
