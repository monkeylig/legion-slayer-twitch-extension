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
        style: DefineKeyword("The next lightning ability that affects you will cause you to take 12 true damage. Lightning attacks have a 30% chance of surging their target.")
    },
    {
        text: /[dD]renched/,
        style: DefineKeyword("Lightning attacks deal 5 additional true damage to you. Water attacks dealing 15% of the target's max health in damage will drench their target.")
    },
    {
        text: /[fF]rozen/,
        style: DefineKeyword("Your items and abilities have a 50% chance of failing. If you are drenched, you have a 50% chance of freezing.")
    },
    {
        text: /[wW]eapon speed/,
        style: DefineKeyword("The stat that determines how fast your strike and strike ability moves are. Whichever player uses the fastest move will go first.")
    }
];