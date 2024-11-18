/**
 * @import {AbilityData, WeaponData} from "./backend-calls"
 */

/**
 * @typedef {Object} GrowthObject
 * @property {number} maxHealth
 * @property {number} strength
 * @property {number} magic
 * @property {number} defense
 */

/**@type {(abilityData: AbilityData, stat: string) => boolean} */
function hasAbilityStat(abilityData, stat) {
    if (abilityData[stat]) {
        return true;
    }

    if (abilityData.postActions) {
        for (const action of abilityData.postActions) {
            if (action[stat]) {
                return true;
            }
        }
    }

    return false;
}

/**@type {(type: string) => string} */
function typeToStat(type) {
    if (type === 'physical') {
        return 'strength';
    }
    else if (type === 'magical') {
        return 'magic'
    }

    return 'maxHealth';
};

/**
 * 
 * @param {AbilityData} ability 
 * @param {number} multiplier 
 * @returns {GrowthObject}
 */
function calcAbilityGrowStats(ability, multiplier=1) {
    const growthObject = {
        maxHealth: 1,
        strength: 1,
        magic: 1,
        defense: 1
    };

    if (ability.type) {
        if (ability.baseDamage && ability.baseDamage >= 50) {
            growthObject[typeToStat(ability.type)] += multiplier;
        }
    }

    if (hasAbilityStat(ability, 'protection')) {
        growthObject.maxHealth += multiplier;
        growthObject.defense += multiplier;
    }

    if (hasAbilityStat(ability, 'heal') ||
        hasAbilityStat(ability, 'healPercent') ||
        hasAbilityStat(ability, 'absorb') ||
        hasAbilityStat(ability, 'revive')
    )
    {
        growthObject.maxHealth += multiplier;
    }

    if (hasAbilityStat(ability, 'defenseAmp') ||
        hasAbilityStat(ability, 'lightningResistAmp') ||
        hasAbilityStat(ability, 'fireResistAmp') ||
        hasAbilityStat(ability, 'waterResistAmp') ||
        hasAbilityStat(ability, 'recoil')
    ) {
        growthObject.defense += multiplier;
    }

    return growthObject;
}

/**
 * 
 * @param {WeaponData} weapon 
 * @returns {GrowthObject}
 */
function calcWeaponGrowthStats(weapon) {
    return calcAbilityGrowStats(weapon.strikeAbility);
}

export {calcAbilityGrowStats, calcWeaponGrowthStats};
