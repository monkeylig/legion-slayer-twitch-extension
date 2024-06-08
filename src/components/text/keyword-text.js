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
    return `A player's defense against ${element} attacks.`;
}

function defineKeyword(definition) {
    const toolTipAid = ({children}) => {
        const splitTerm = children.split(' ');

        for(let i=0; i < splitTerm.length; i++) {
            splitTerm[i] = makeProperWord(splitTerm[i]);
        }
        const keyword = splitTerm.join(' ');
        
        return (
            <Tooltip layout={<><span style={{color: 'yellow'}}>{keyword}: </span>{definition}</>}>
                <span className={keywordStyles.keywordText}>{children}</span>
            </Tooltip>
        );
    };

    return toolTipAid;
}

function generateTooltipAid(children, definition) {
    const TootipAid = defineKeyword(definition);
    
    return (
        <TootipAid>{children}</TootipAid>
    );
}

const textStyleData = [
    {
        text: /\w+ [rR]esistance/,
        style: ({children}) => generateTooltipAid(children, defineElementalResistance(children))
    },
    {
        text: /[iI]mbue/,
        style: defineKeyword("The target's strikes have an element bound to it. Strikes can now trigger status conditions.")
    }

];