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

  const resolvedBaseEnemyCoefficient = enemyDefenseRank === "CUSTOM" ? baseEnemyCoefficient : ENEMY_RANK_BASE[enemyDefenseRank];

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
    <div className="mx-auto max-w-[1520px] bg-[#050a12] p-4 text-slate-100 md:p-6">
      <header className="mb-4 border border-slate-600/60 bg-[#09111c] px-4 py-3 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.06)]">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
          <div>
            <h1 className="text-lg font-semibold tracking-[0.18em] text-cyan-100 md:text-xl">ENDFIELD DAMAGE CALCULATOR / RESEARCH UI</h1>
            <p className="mt-1 text-xs text-slate-400">{isJa ? "エンドフィールド向けダメージ計算式検証パネル" : "Damage formula verification panel for Endfield"}</p>
          </div>
          <div className="flex flex-wrap gap-1 text-[10px] tracking-widest text-slate-300">
            {["CHARA", "SKILL", "ENEMY", "BUFF", "RESULT"].map((tab) => (
              <span key={tab} className="border border-slate-600/70 bg-[#0d1623] px-2 py-1">{tab}</span>
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {damagePresets.map((preset) => (
            <button key={preset.key} className="border border-slate-600/70 bg-[#0d1623] px-2 py-1 text-xs text-slate-200 hover:bg-[#152136]" onClick={() => applyPreset(preset.input)}>
              {isJa ? preset.labelJa : preset.labelEn}
            </button>
          ))}
        </div>
      </header>

      <div className="grid gap-2 xl:grid-cols-3">
        <Panel title="CHARACTER / CORE STATUS">
          <NumberField label={isJa ? "キャラ基礎攻撃力" : "Character base ATK"} value={characterAtk} setValue={setCharacterAtk} />
          <NumberField label={isJa ? "武器攻撃力" : "Weapon ATK"} value={weaponAtk} setValue={setWeaponAtk} />
          <NumberField label={isJa ? "攻撃力%（0.2 = 20%）" : "ATK% bonus (0.2 = 20%)"} value={atkPercentBonus} setValue={setAtkPercentBonus} step={0.01} />
          <NumberField label={isJa ? "固定攻撃力" : "Flat ATK bonus"} value={flatAtkBonus} setValue={setFlatAtkBonus} />
          <NumberField label={isJa ? "メイン能力" : "Primary stat"} value={primaryStat} setValue={setPrimaryStat} />
          <NumberField label={isJa ? "サブ能力" : "Secondary stat"} value={secondaryStat} setValue={setSecondaryStat} />
          <TextNumberField label={isJa ? "最終攻撃力の直接入力（任意）" : "Final ATK manual override (optional)"} value={manualFinalAtk} setValue={setManualFinalAtk} />
        </Panel>

        <Panel title="SKILL / DAMAGE SETUP">
          <NumberField label={isJa ? "スキル倍率" : "Skill multiplier"} value={skillMultiplier} setValue={setSkillMultiplier} step={0.01} />
          <NumberField label={isJa ? "Hit数" : "Hit count"} value={hitCount} setValue={setHitCount} />
          <SelectField
            label={isJa ? "倍率モード" : "Multiplier mode"}
            value={multiplierMode}
            setValue={(v) => setMultiplierMode(v as MultiplierMode)}
            options={[{ value: "totalMultiplier", label: "totalMultiplier" }, { value: "perHitMultiplier", label: "perHitMultiplier" }]}
          />
          <SelectField
            label={isJa ? "丸め方式" : "Rounding mode"}
            value={roundingMode}
            setValue={(v) => setRoundingMode(v as RoundingMode)}
            options={[{ value: "perHit", label: "perHit" }, { value: "finalTotal", label: "finalTotal" }]}
          />
          <SelectField
            label={isJa ? "丸め関数" : "Rounding function"}
            value={roundingFunction}
            setValue={(v) => setRoundingFunction(v as RoundingFunction)}
            options={[{ value: "round", label: "round" }, { value: "floor", label: "floor" }, { value: "ceil", label: "ceil" }]}
          />
        </Panel>

        <Panel title="ENEMY / BUFF STATUS">
          <SelectField
            label={isJa ? "敵防御ランク" : "Enemy defense rank"}
            value={enemyDefenseRank}
            setValue={(v) => setEnemyDefenseRank(v as EnemyDefenseRank)}
            options={[{ value: "D", label: "D (0.50)" }, { value: "C", label: "C (0.60)" }, { value: "B", label: "B (0.75)" }, { value: "CUSTOM", label: "CUSTOM" }]}
          />
          {enemyDefenseRank === "CUSTOM" && (
            <NumberField label={isJa ? "敵係数（CUSTOM）" : "Base enemy coefficient (CUSTOM)"} value={baseEnemyCoefficient} setValue={setBaseEnemyCoefficient} step={0.01} />
          )}
          <NumberField label={isJa ? "敵係数補正 rate" : "Enemy coefficient rate bonus"} value={enemyCoefficientRateBonus} setValue={setEnemyCoefficientRateBonus} step={0.01} />
          <NumberField label={isJa ? "敵係数補正 flat" : "Enemy coefficient flat bonus"} value={enemyCoefficientFlatBonus} setValue={setEnemyCoefficientFlatBonus} step={0.01} />
          <NumberField label={isJa ? "敵被ダメ増加" : "Enemy damage taken"} value={enemyDamageTaken} setValue={setEnemyDamageTaken} step={0.01} />

          <label className="mt-2 flex items-center gap-2 border border-slate-700/60 bg-[#0d1623] px-2 py-2 text-xs text-slate-300">
            <input type="checkbox" checked={applyAtkPercentBucketInAtkPhase} onChange={(e) => setApplyAtkPercentBucketInAtkPhase(e.target.checked)} />
            {isJa ? "atk_percent bucket をATK計算側で適用" : "Apply atk_percent in ATK phase"}
          </label>

          <div className="mt-2">
            <div className="mb-1 text-[11px] tracking-widest text-slate-400">BUFF BUCKETS</div>
            <div className="space-y-1">
              {buckets.map((bucket, idx) => (
                <div key={bucket.id} className="grid grid-cols-12 gap-1 border border-slate-700/60 bg-[#0d1623] p-1">
                  <input className="col-span-3 bg-[#0a111c] px-1 py-1 text-xs" value={bucket.label} onChange={(e) => updateBucket(idx, { label: e.target.value })} />
                  <select className="col-span-4 bg-[#0a111c] px-1 py-1 text-xs" value={bucket.bucket} onChange={(e) => updateBucket(idx, { bucket: e.target.value as BuffBucketKey })}>
                    <option value="atk_percent">atk_percent</option><option value="damage_bonus">damage_bonus</option><option value="elemental_damage_bonus">elemental_damage_bonus</option><option value="skill_damage_bonus">skill_damage_bonus</option><option value="enemy_damage_taken">enemy_damage_taken</option><option value="final_multiplier">final_multiplier</option>
                  </select>
                  <input className="col-span-3 bg-[#0a111c] px-1 py-1 text-xs" type="number" step="0.01" value={bucket.value} onChange={(e) => updateBucket(idx, { value: Number(e.target.value) })} />
                  <label className="col-span-2 flex items-center justify-center text-xs"><input type="checkbox" checked={bucket.enabled} onChange={(e) => updateBucket(idx, { enabled: e.target.checked })} />ON</label>
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <button className="border border-slate-600/70 bg-[#0d1623] px-2 py-1 text-xs hover:bg-[#152136]" onClick={() => setBuckets((prev) => [...prev, { id: crypto.randomUUID(), label: "New Bucket", bucket: "damage_bonus", value: 0.1, enabled: true }])}>{isJa ? "bucket追加" : "Add bucket"}</button>
              <button className="border border-slate-600/70 bg-[#0d1623] px-2 py-1 text-xs hover:bg-[#152136]" onClick={() => setBuckets((prev) => prev.slice(0, -1))}>{isJa ? "最後を削除" : "Remove last"}</button>
            </div>
          </div>
        </Panel>
      </div>

      <section className="mt-3 border border-slate-700/60 bg-[#0a1019] p-3">
        <div className="mb-2 flex items-end justify-between">
          <div className="text-[11px] tracking-[0.2em] text-cyan-200">RESULT / BREAKDOWN</div>
          <div className="text-2xl font-bold text-cyan-300">{result.finalTotalDamage.toLocaleString()}</div>
        </div>

        <div className="grid gap-1 text-xs md:grid-cols-2 xl:grid-cols-5">
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

        <div className="mt-2 border border-slate-700/60 bg-[#0d1623] p-2 text-xs text-slate-300 whitespace-pre-wrap">
          <div className="mb-1 text-[10px] tracking-widest text-slate-400">FORMULA TRACE</div>
          {result.formulaText}
        </div>
      </section>
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

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-slate-700/60 bg-[#0a1019] p-3">
      <div className="mb-2 text-[11px] tracking-[0.2em] text-cyan-200">{title}</div>
      <div className="grid gap-2">{children}</div>
    </section>
  );
}

function NumberField({ label, value, setValue, step = 1 }: { label: string; value: number; setValue: (v: number) => void; step?: number }) {
  return <FieldShell label={label}><input className="w-full border border-slate-700/60 bg-[#0a111c] px-2 py-1.5 text-sm" type="number" step={step} value={value} onChange={(e) => setValue(Number(e.target.value))} /></FieldShell>;
}

function TextNumberField({ label, value, setValue }: { label: string; value: string; setValue: (v: string) => void }) {
  return <FieldShell label={label}><input className="w-full border border-slate-700/60 bg-[#0a111c] px-2 py-1.5 text-sm" type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="(optional)" /></FieldShell>;
}

function SelectField({ label, value, setValue, options }: { label: string; value: string; setValue: (v: string) => void; options: Array<{ value: string; label: string }> }) {
  return <FieldShell label={label}><select className="w-full border border-slate-700/60 bg-[#0a111c] px-2 py-1.5 text-sm" value={value} onChange={(e) => setValue(e.target.value)}>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></FieldShell>;
}

function FieldShell({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="text-xs"><div className="mb-1 tracking-wide text-slate-400">{label}</div>{children}</label>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="border border-slate-700/60 bg-[#0d1623] px-2 py-1"><span className="text-slate-400">{label}: </span><span className="text-cyan-200">{value}</span></div>;
}
