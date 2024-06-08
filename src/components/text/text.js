export default function RPGText({style, styleData = [], children}) {
    const getStringValue = (value) => {
        if (value instanceof RegExp) {
            return value.source;
        }
        return value;
    };

    const styleMap = {};
    for(const styleItem of styleData) {
        const regex = new RegExp(styleItem.text, "g");
        const matchesFound = children.match(regex);
        if(matchesFound) {
            for(const match of matchesFound) {
                styleMap[match] = styleItem.style;
            }
        }
    }

    const masterExp = "(" + styleData.reduce((accumulator, currentValue, index) => {
        if (index === 0) {
            return accumulator;
        }
        
        return `${accumulator}|${getStringValue(currentValue.text)}`;
    }, styleData[0] ? getStringValue(styleData[0].text) : '') + ")";

    const searchExp = new RegExp(masterExp);
    const splitText = children.split(searchExp).filter(chunk => chunk !== '');

    const styledText = splitText.map((chunk, index) => {
        if (styleMap[chunk]) {
            const StyleFunc = styleMap[chunk];
            return <StyleFunc key={index}>{chunk}</StyleFunc>
        }
        return chunk;
    });

    return (
        <span style={style}>
            {styledText}
        </span>
    );
}

/*
function TextTest() {
    const styleData = [
        {
            text: `k\\w*r`,
            style: ({children})=> <span style={{color: 'green'}}>{children}</span>
        },
        {
            text: 'Text',
            style: ({children})=> <span style={{color: 'red'}}>{children}</span>
        },
        {
            text: '\\d+% physical protection',
            style: ({children})=> <span style={{color: colors.blue}}>{children}</span>
        },
        {
            text: '\\d+% magical protection',
            style: ({children})=> <span style={{color: colors.orange}}>{children}</span>
        },
        {
            text: 'containing',
            style: ({children})=> <span style={{color: 'pink'}}>{children}</span>
        },
        {
            text: 'that need s',
            style: ({children})=> <span style={{color: 'gold'}}>{children}</span>
        },
    ];
    return <Text styleData={styleData}>Text containing keywords that need special formating 70% physical protection 30% magical protection</Text>;
}
 */