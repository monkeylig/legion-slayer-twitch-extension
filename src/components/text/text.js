function Text({styleData = [], children}) {
    
    const masterExp = "(" + styleData.reduce((accumulator, currentValue, index) => {
        if (index === 0) {
            return accumulator;
        }
        
        return `${accumulator}|${currentValue.text}`;
    }, styleData[0] ? styleData[0].text : '') + ")";

    const searchExp = new RegExp(masterExp);
    const splitText = children.split(searchExp).filter(chunk => chunk !== '');

    const styledText = splitText.map((chunk, index) => {
        for (const textStyle of styleData) {
            let textMatch = new RegExp(textStyle.text);
            if (textMatch.test(chunk)) {
                const StyleFunc = textStyle.style;
                return <StyleFunc key={index}>{chunk}</StyleFunc>
            }
        }

        return chunk;
    });

    return (
        <span>
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