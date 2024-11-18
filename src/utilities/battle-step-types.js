/**
 * @import {EffectData} from "./backend-calls"
 */

/**
 * @typedef {Object} BattleStep
 * @property {string} type
 * @property {string} [description]
 * 
 * @typedef {BattleStep & {
 * targetId: string,
 * healAmount: number
 * }} HealStep
 * 
 * @typedef {Object} ProtectionData
 * @property {number} [physical]
 * @property {number} [magical]
 * 
 * @typedef {BattleStep & {
 * targetId: string,
 * protection: ProtectionData
 * }} ProtectionStep
 * 
 * @typedef {BattleStep & {
 * targetId: string,
 * netChange: number
 * }} ApChangeStep
 * 
 * @typedef {BattleStep & {
 * successful: boolean,
 * effect: EffectData
 * }} AddEffectStep
 * 
 * @typedef {AddEffectStep} RemoveEffectStep
 */

export default {};