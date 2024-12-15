/**
 * @import {AbilityData, AgentData, WeaponData} from "./backend-calls"
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
        if (ability.baseDamage && ability.baseDamage >= 0) {
            growthObject[typeToStat(ability.type)] += multiplier;
        }
    }

    if (hasAbilityStat(ability, 'strengthAmp') ||
        hasAbilityStat(ability, 'magicAmp')) {
        growthObject.defense += multiplier;
        if (hasAbilityStat(ability, 'strengthAmp')) {
            growthObject.strength += multiplier;
        }
        if (hasAbilityStat(ability, 'strengthAmp')) {
            growthObject.magic += multiplier;
        }
    }

    if (hasAbilityStat(ability, 'empowerment')) {
        growthObject.maxHealth += multiplier;
        if (ability.empowerment?.physical) {
            growthObject.strength += multiplier;
        }
        if (ability.empowerment?.magical) {
            growthObject.magic += multiplier;
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

/**
 * 
 * @param {GrowthObject} growLeft 
 * @param {GrowthObject} growRight 
 */
function addGrowthObject(growLeft, growRight) {
    growLeft.defense += growRight.defense;
    growLeft.magic += growRight.magic;
    growLeft.maxHealth += growRight.maxHealth;
    growLeft.strength += growRight.strength;
}

/**
 * 
 * @param {AgentData} agent 
 * @returns {GrowthObject}
 */
function calcAgentGrowthStats(agent) {
    const growthObject = calcWeaponGrowthStats(agent.weapon);

    for (const ability of agent.abilities) {
        const abilityGrowth = calcAbilityGrowStats(ability);
        addGrowthObject(growthObject, abilityGrowth);
    }

    return growthObject;
}

/**
 * 
 * @param {AbilityData} abilityData 
 * @returns {AbilityData[]}
 */
function getReferencedAbilities(abilityData) {
    const referencedAbilities = [];
    if (abilityData.addAbility) {
        referencedAbilities.push(abilityData.addAbility);
    }

    if (abilityData.postActions) {
        for (const action of abilityData.postActions) {
            if (action.addAbility) {
                referencedAbilities.push(abilityData.addAbility);
            }
        }
    }
    return referencedAbilities;
}

export {calcAbilityGrowStats, calcWeaponGrowthStats, calcAgentGrowthStats, getReferencedAbilities};
