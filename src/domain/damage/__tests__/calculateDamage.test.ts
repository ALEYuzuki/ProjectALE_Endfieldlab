import test from "node:test";
import assert from "node:assert/strict";
import { calculateDamage, type EndfieldDamageInput } from "@/src/domain/damage/calculateDamage";

const base: EndfieldDamageInput = { characterBaseAtk: 700, weaponAtk: 300, armorAtkFlat: 0, otherAtkFlat: 0, atkPercentBonus: 0, finalAtkManualOverride: null, skillMultiplier: 100, hitCount: 1, multiplierSplitMode: "perHitMultiplier", enemyDefenseRank: "D", defenseRateReduction: 0, defenseIgnoreFlat: 0, buffs: [], roundingMode: "perHit" };

test("basic", ()=> assert.equal(calculateDamage(base).totalDamage, 500));
test("same bucket additive", ()=> assert.equal(calculateDamage({...base,buffs:[{id:"1",name:"",bucket:"damage_bonus",value:20,enabled:true},{id:"2",name:"",bucket:"damage_bonus",value:30,enabled:true}]}).totalDamage, 750));
test("different bucket mult", ()=> assert.equal(calculateDamage({...base,buffs:[{id:"1",name:"",bucket:"damage_bonus",value:20,enabled:true},{id:"2",name:"",bucket:"enemy_damage_taken",value:30,enabled:true}]}).totalDamage, 780));
test("defense rank B", ()=> assert.equal(calculateDamage({...base,enemyDefenseRank:"B"}).totalDamage, 250));
test("defense reduction", ()=> assert.equal(calculateDamage({...base,enemyDefenseRank:"B",defenseRateReduction:0.2}).totalDamage, 400));
test("defense ignore", ()=> assert.equal(calculateDamage({...base,enemyDefenseRank:"B",defenseIgnoreFlat:0.1}).totalDamage, 350));
test("rounding modes", ()=> { const x={...base,skillMultiplier:46,hitCount:6,multiplierSplitMode:"totalMultiplier" as const}; assert.notEqual(calculateDamage({...x,roundingMode:"perHit"}).totalDamage, calculateDamage({...x,roundingMode:"finalTotal"}).totalDamage);});
test("manual override", ()=> assert.equal(calculateDamage({...base,finalAtkManualOverride:2000}).displayedAtk, 2000));
