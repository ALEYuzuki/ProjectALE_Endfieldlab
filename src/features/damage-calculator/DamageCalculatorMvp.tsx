"use client";
import { useMemo, useState } from "react";
import { calculateDamage, type DamageBuff, type EndfieldDamageInput } from "@/src/domain/damage/calculateDamage";
import { ENEMY_DEFENSE_RATES } from "@/src/domain/damage/enemyDefense";
import { damagePresets } from "@/src/data/damage/samplePresets";

const defaultInput: EndfieldDamageInput = damagePresets[0].input;

export default function DamageCalculatorMvp({ locale }: { locale: string }) {
  const isJa = locale === "ja";
  const [input, setInput] = useState<EndfieldDamageInput>(defaultInput);
  const result = useMemo(() => calculateDamage(input), [input]);
  const set = <K extends keyof EndfieldDamageInput>(k: K, v: EndfieldDamageInput[K]) => setInput((p) => ({ ...p, [k]: v }));
  const updateBuff = (i: number, b: Partial<DamageBuff>) => setInput((p) => ({ ...p, buffs: p.buffs.map((x, idx) => idx === i ? { ...x, ...b } : x) }));

  return <div className="mx-auto max-w-6xl p-6 text-zinc-100">
    <h1 className="text-2xl font-semibold mb-4">{isJa ? "Endfield Damage Model v1" : "Endfield Damage Model v1"}</h1>
    <div className="grid md:grid-cols-2 gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
      {(["characterBaseAtk","weaponAtk","armorAtkFlat","otherAtkFlat","atkPercentBonus","finalAtkManualOverride","skillMultiplier","hitCount","defenseRateReduction","defenseIgnoreFlat"] as const).map((k) =>
        <label key={k} className="text-sm"><div className="text-zinc-400 mb-1">{k}</div><input className="w-full rounded bg-zinc-900 border border-zinc-800 px-2 py-1" type="number" value={(input as any)[k] ?? ""} onChange={(e)=>set(k as any, e.target.value === "" ? null : Number(e.target.value) as any)} /></label>
      )}

      <label className="text-sm"><div className="text-zinc-400 mb-1">multiplierSplitMode</div><select className="w-full rounded bg-zinc-900 border border-zinc-800 px-2 py-1" value={input.multiplierSplitMode} onChange={(e)=>set("multiplierSplitMode", e.target.value as any)}><option value="totalMultiplier">totalMultiplier</option><option value="perHitMultiplier">perHitMultiplier</option></select></label>
      <label className="text-sm"><div className="text-zinc-400 mb-1">enemyDefenseRank</div><select className="w-full rounded bg-zinc-900 border border-zinc-800 px-2 py-1" value={input.enemyDefenseRank} onChange={(e)=>set("enemyDefenseRank", e.target.value as any)}>{Object.entries(ENEMY_DEFENSE_RATES).map(([k,v])=><option key={k} value={k}>{k} ({v})</option>)}</select></label>
      <label className="text-sm"><div className="text-zinc-400 mb-1">roundingMode</div><select className="w-full rounded bg-zinc-900 border border-zinc-800 px-2 py-1" value={input.roundingMode} onChange={(e)=>set("roundingMode", e.target.value as any)}><option value="perHit">perHit</option><option value="finalTotal">finalTotal</option></select></label>
    </div>

    <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
      <div className="flex gap-2 flex-wrap">{damagePresets.map((p)=><button key={p.key} className="rounded border border-zinc-700 px-2 py-1" onClick={()=>setInput(structuredClone(p.input))}>{isJa?p.labelJa:p.labelEn}</button>)}</div>
    </div>

    <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
      <div className="mb-2 text-sm text-zinc-400">buff buckets</div>
      {input.buffs.map((b,i)=><div key={b.id} className="grid grid-cols-12 gap-2 mb-2"><input className="col-span-3 rounded bg-zinc-900 border border-zinc-800 px-2" value={b.name} onChange={(e)=>updateBuff(i,{name:e.target.value})}/><select className="col-span-4 rounded bg-zinc-900 border border-zinc-800 px-2" value={b.bucket} onChange={(e)=>updateBuff(i,{bucket:e.target.value as any})}>{["atk_percent","damage_bonus","elemental_damage_bonus","skill_damage_bonus","enemy_damage_taken","arts_intensity","final_multiplier"].map((x)=><option key={x}>{x}</option>)}</select><input className="col-span-3 rounded bg-zinc-900 border border-zinc-800 px-2" type="number" value={b.value} onChange={(e)=>updateBuff(i,{value:Number(e.target.value)})}/><label className="col-span-2"><input type="checkbox" checked={b.enabled} onChange={(e)=>updateBuff(i,{enabled:e.target.checked})}/>ON</label></div>)}
      <button className="rounded border border-zinc-700 px-2 py-1" onClick={()=>setInput((p)=>({...p,buffs:[...p.buffs,{id:crypto.randomUUID(),name:"buff",bucket:"damage_bonus",value:10,enabled:true}]}))}>+ buff</button>
    </div>

    <div className="mt-4 rounded-2xl border border-emerald-800 bg-emerald-950/20 p-4 text-sm space-y-1">
      <div>表示攻撃力: {result.displayedAtk.toFixed(2)}</div><div>1Hit倍率: {result.perHitSkillMultiplier.toFixed(4)}</div><div>Hit数: {result.hitCount}</div><div>自分側バフ係数: {result.selfBuffMultiplier.toFixed(4)}</div><div>敵防御ランク: {result.enemyDefenseRank}</div><div>調整前防御係数: {result.baseDefenseRate.toFixed(4)}</div><div>防御率低下後の防御係数: {result.afterRateReductionDefenseRate.toFixed(4)}</div><div>防御無視後の防御係数: {result.afterFlatIgnoreDefenseRate.toFixed(4)}</div><div>敵側最終係数: {result.enemySideMultiplier.toFixed(4)}</div><div>1Hitダメージ: {result.perHitDamage.toFixed(2)}</div><div>合計ダメージ: {result.totalDamage.toFixed(2)}</div><div>丸め方式: {result.roundingMode}</div><div>計算式: {result.formula}</div>
    </div>
  </div>;
}
