import Tooltip from "../tooltip/tooltip";
import RPGText from "./text";
import keywordStyles from "./keyword-text.module.css"

export default function KeywordText({style, children}) {
    return (
        <RPGText style={style} styleData={textStyleData}>{children}</RPGText>
    );
}

function makeProperWord(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function defineElementalResistance(matchedStr) {
    const element = matchedStr.split(' ')[0].toLowerCase();
    return `Your defense against ${element} attacks.`;
}

function defineEmpowerment(matchedStr) {
    const type = matchedStr.split(' ')[0].toLowerCase();
    return `The base damage of the your next ${type} attack is increased by this amount.`;
}

function defineProtection(matchedStr) {
    const type = matchedStr.split(' ')[0].toLowerCase();
    return `A percentage of your max health is added to your health pool. This part of your 
    health is only reduced by ${type} attacks, enabling you to take more ${type} damage. `;
}

function DefineKeyword(definition) {
    const toolTipAid = ({children}) => {
        const splitTerm = children.split(' ');

        for(let i=0; i < splitTerm.length; i++) {
            splitTerm[i] = makeProperWord(splitTerm[i]);
        }
        const keyword = splitTerm.join(' ');
        
        return (
            <Tooltip layout={<div className={keywordStyles['keyword-tooltip']}><span style={{color: 'yellow'}}>{keyword}: </span><RPGText styleData={textStyleData}>{definition}</RPGText></div>}>
                <span className={keywordStyles.keywordText}>{children}</span>
            </Tooltip>
        );
    };

    return toolTipAid;
}

/**
 * 
 * @param {string} children 
 * @param {string} definition 
 * @returns 
 */
function generateTooltipAid(children, definition) {
    const TooltipAid = DefineKeyword(definition);
    
    return (
        <TooltipAid>{children}</TooltipAid>
    );
}

const textStyleData = [
    {
        text: /\w+ [rR]esistance/,
        style: ({children}) => generateTooltipAid(children, defineElementalResistance(children))
    },
    {
        text: /[iI]mbue[sd]?/,
        style: DefineKeyword("Your strikes have an element bound to it. Strikes can now trigger status conditions.")
    },
    {
        text: /[pP]riority/,
        style: DefineKeyword("Abilities with activate first during the current round of battle before most abilities.")
    },
    {
        text: /\w+ [eE]mpowerment/,
        style: ({children}) => generateTooltipAid(children, defineEmpowerment(children))
    },
    {
        text: /\w+ [pP]rotection/,
        style: ({children}) => generateTooltipAid(children, defineProtection(children))
    },
    {
        text: /[sS]urged/,
        style: DefineKeyword("The next lightning ability that affects you will cause you to take 12% true damage. Lightning attacks have a 30% chance of surging their target.")
    },
    {
        text: /[dD]renched/,
        style: DefineKeyword("Take 5% additional true damage from lightning attacks. Water attacks dealing 15% of the target's max health in damage will drench their target.")
    },
    {
        text: /[aA]blazed/,
        style: DefineKeyword("Take 6% true damage every turn. Fire attacks have a 30% chance of ablazing their target.")
    },
    {
        text: /[fF]rozen/,
        style: DefineKeyword("Your items and abilities have a 50% chance of failing. If you are drenched, you have a 50% chance of freezing.")
    },
    {
        text: /[wW]eapon speed/,
        style: DefineKeyword("The stat that determines how fast your strike and strike ability moves are. Whichever player uses the fastest move will go first.")
    },
    {
        text: /[cC]ounters?/,
        style: DefineKeyword("The target's move is cancelled and does nothing.")
    },
    {
        text: /AP/,
        style: DefineKeyword("Ability Points. these allow you to use abilities. Abilities have an Ability Point cost, which must be paid to use an ability in battle.")
    },
    {
        text: /[hH][pP]/,
        style: DefineKeyword("Health Points. This is how much damage you can take before you are defeated.")
    },
    {
        text: /[gG]ain the abilit(?:y|ies) [\w\s]*/,
        style: DefineKeyword("Gain an extra ability to use in battle. See the ability described below.")
    },
    {
        text: /[bB]ase [dD]amage/,
        style: DefineKeyword("An attack's destructive power. It is increased by your level and your strength or magic, but it is decreased by the target's defense.")
    },
    {
        text: /[sS]trike [aA]bility/,
        style: DefineKeyword("Your weapon's special ability. Strike your target 2 times to ready this ability.")
    },
    {
        text: /[sS]trikes?/,
        style: DefineKeyword("The first option in the battle menu. It's free to use and gives you one AP so that you can use your abilities. Unfortunately, this attack is very weak.")
    },
    {
        text: /[rR]ecoil [dD]amage/,
        style: DefineKeyword("A percentage of the damage that you deal to your target will also be dealt to you.")
    },
    {
        text: /[tT]rue [dD]amage/,
        style: DefineKeyword("A percentage of your health dealt as damage. Increasing your health faster than normal will reduce how much damage you take.")
    },
    {
        text: /[eE]lement [fF]usion/,
        style: DefineKeyword("Attacks with more than one element bound them will deal 20% more damage. Look at the colors of your abilities to see how many elements are bound to them.")
    },
];