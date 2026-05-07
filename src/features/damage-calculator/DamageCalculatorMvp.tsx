"use client";

import { useMemo, useState } from "react";
import { calculateDamage, type DamageBuff } from "@/src/domain/damage/calculateDamage";
import { damagePresets } from "@/src/data/damage/samplePresets";

type Props = { locale: string };

export default function DamageCalculatorMvp({ locale }: Props) {
  const isJa = locale === "ja";
  const [baseDamagePerHit, setBaseDamagePerHit] = useState(1000);
  const [hitCount, setHitCount] = useState(5);
  const [enemyDefenseCoefficient, setEnemyDefenseCoefficient] = useState(0.5);
  const [defenseReductionPercent, setDefenseReductionPercent] = useState(0);
  const [defenseIgnorePercent, setDefenseIgnorePercent] = useState(0);
  const [roundPerHit, setRoundPerHit] = useState(true);
  const [roundTotal, setRoundTotal] = useState(true);
  const [buffs, setBuffs] = useState<DamageBuff[]>([
    { id: "atk", name: "ATK Up", percent: 30, kind: "additive", enabled: true },
    { id: "skill", name: "Skill DMG", percent: 20, kind: "additive", enabled: true },
    { id: "vuln", name: "Vulnerability", percent: 12, kind: "multiplicative", enabled: true }
  ]);

  const result = useMemo(() => calculateDamage({
    baseDamagePerHit,
    hitCount,
    roundPerHit,
    roundTotal,
    buffs,
    defense: { enemyDefenseCoefficient, defenseReductionPercent, defenseIgnorePercent }
  }), [baseDamagePerHit, hitCount, roundPerHit, roundTotal, buffs, enemyDefenseCoefficient, defenseReductionPercent, defenseIgnorePercent]);

  return (
    <div className="mx-auto max-w-6xl p-6 text-zinc-100">
      <h1 className="mb-2 text-2xl font-semibold">{isJa ? "ダメージ計算式シミュレーター" : "Damage Formula Simulator"}</h1>
      <p className="mb-6 text-sm text-zinc-400">{isJa ? "同種加算・別枠乗算・防御係数・丸め挙動を検証できます。" : "Validate additive/multiplicative buffs, defense scaling, and rounding behavior."}</p>

      <div className="grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 md:grid-cols-2">
        <NumberField label={isJa ? "基礎ダメージ / Hit" : "Base damage / hit"} value={baseDamagePerHit} setValue={setBaseDamagePerHit} />
        <NumberField label={isJa ? "Hit数" : "Hit count"} value={hitCount} setValue={setHitCount} />
        <NumberField label={isJa ? "敵防御係数" : "Enemy defense coefficient"} value={enemyDefenseCoefficient} setValue={setEnemyDefenseCoefficient} step={0.01} />
        <NumberField label={isJa ? "防御率低下(%)" : "Defense reduction (%)"} value={defenseReductionPercent} setValue={setDefenseReductionPercent} />
        <NumberField label={isJa ? "防御無視(%)" : "Defense ignore (%)"} value={defenseIgnorePercent} setValue={setDefenseIgnorePercent} />

        <div className="col-span-full flex flex-wrap gap-4 text-sm">
          <label><input type="checkbox" checked={roundPerHit} onChange={(e) => setRoundPerHit(e.target.checked)} /> {isJa ? "Hitごと丸め" : "Round per hit"}</label>
          <label><input type="checkbox" checked={roundTotal} onChange={(e) => setRoundTotal(e.target.checked)} /> {isJa ? "合計後丸め" : "Round after total"}</label>
        </div>

        <div className="col-span-full">
          <p className="mb-2 text-sm text-zinc-400">{isJa ? "バフ" : "Buffs"}</p>
          <div className="space-y-2">
            {buffs.map((buff, idx) => (
              <div key={buff.id} className="grid grid-cols-12 gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-2">
                <input className="col-span-4 rounded bg-zinc-800 px-2 py-1" value={buff.name} onChange={(e) => updateBuff(idx, { name: e.target.value })} />
                <select className="col-span-3 rounded bg-zinc-800 px-2 py-1" value={buff.kind} onChange={(e) => updateBuff(idx, { kind: e.target.value as DamageBuff['kind'] })}>
                  <option value="additive">{isJa ? "同種加算" : "Additive"}</option>
                  <option value="multiplicative">{isJa ? "別枠乗算" : "Multiplicative"}</option>
                </select>
                <input className="col-span-3 rounded bg-zinc-800 px-2 py-1" type="number" value={buff.percent} onChange={(e) => updateBuff(idx, { percent: Number(e.target.value) })} />
                <label className="col-span-2 flex items-center justify-center gap-1 text-xs"><input type="checkbox" checked={buff.enabled} onChange={(e) => updateBuff(idx, { enabled: e.target.checked })} />ON</label>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <button className="rounded border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-800" onClick={() => setBuffs((prev) => [...prev, { id: crypto.randomUUID(), name: "New Buff", percent: 10, kind: "additive", enabled: true }])}>{isJa ? "バフ追加" : "Add buff"}</button>
            <button className="rounded border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-800" onClick={() => setBuffs((prev) => prev.slice(0, -1))}>{isJa ? "最後を削除" : "Remove last"}</button>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-emerald-700/30 bg-emerald-950/20 p-4">
        <p>{isJa ? "最終ダメージ" : "Final damage"}: <span className="text-2xl font-bold text-emerald-300">{result.totalDamageAfterRounding.toLocaleString()}</span></p>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-zinc-300 md:grid-cols-2">
        <Stat label="Additive" value={result.additiveMultiplier.toFixed(3)} />
        <Stat label="Multiplicative" value={result.multiplicativeMultiplier.toFixed(3)} />
        <Stat label={isJa ? "防御係数" : "Defense multiplier"} value={result.defenseMultiplier.toFixed(3)} />
        <Stat label={isJa ? "Hit後" : "Per hit (rounded)"} value={result.perHitDamageAfterRounding.toFixed(2)} />
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-800 p-4">
        <p className="mb-2 text-sm text-zinc-400">{isJa ? "サンプルプリセット" : "Sample presets"}</p>
        <div className="flex flex-wrap gap-2">
          {damagePresets.map((preset) => (
            <button key={preset.key} className="rounded border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm hover:bg-zinc-800" onClick={() => {
              setBaseDamagePerHit(preset.baseDamagePerHit);
              setHitCount(preset.hitCount);
              setBuffs(preset.buffs);
              setEnemyDefenseCoefficient(preset.enemyDefenseCoefficient);
              setDefenseReductionPercent(preset.defenseReductionPercent);
              setDefenseIgnorePercent(preset.defenseIgnorePercent);
            }}>{isJa ? preset.labelJa : preset.labelEn}</button>
          ))}
        </div>
      </div>
    </div>
  );

  function updateBuff(index: number, partial: Partial<DamageBuff>) {
    setBuffs((prev) => prev.map((b, i) => (i === index ? { ...b, ...partial } : b)));
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

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded border border-zinc-800 bg-zinc-900/50 p-2"><span className="text-zinc-500">{label}: </span>{value}</div>;
}
