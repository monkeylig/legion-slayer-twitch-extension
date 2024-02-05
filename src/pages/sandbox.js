import HeaderBar from "@/components/header-bar/header-bar";
import Head from "next/head";
import sandboxStyle from "@/styles/sandbox.module.css"

import useAnimation from "@/utilities/animation/useAnimation"
import { useCallback, useRef, useState } from "react";
import useTypeWriterAnimation from "@/utilities/animation/useTypeWriterAnimation";
import useNumberAnimation from "@/utilities/animation/useNumberAnimation";
import useIntAnimation from "@/utilities/animation/useIntAnimation";
import colors from "@/utilities/colors";

export default function Sandbox() {
    
    return (
        <>
            <Head>
                <title>Testing Stuff</title>
                <meta name="description" content="Testing stuff." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <HeaderBar title='Sandbox'/>
            <TypeWriterTest/>
        </>
    );
}

function TypeWriterTest() {
    const text1 = "Waiting for a chance to make a cool animation!";
    const text2 = "Wow! this animation is pretty cool!";
    const [animText, setAnimText] = useState(text1);
    const [doneText, setDoneText] = useState();

    const onAnimationEnd = useCallback(() => {
        setDoneText('done')
    }, []);
    const text = useTypeWriterAnimation(animText, 15, onAnimationEnd);

    return (
        <>
            <button onClick={() => {setDoneText(''); setAnimText(text1)}}>Animation text 1</button>
            <button onClick={() => {setDoneText(''); setAnimText(text2)}}>Animation text 2</button>
            <div className={sandboxStyle['container']}>
                {text}
                {doneText && <div>{doneText}</div>}
            </div>
        </>
    );
}

function NumberAnimTest() {
    const num1 = 1;
    const num2 = -1;
    const [toNum, setToNum] = useState(num1);

    const num = useNumberAnimation(0, toNum, 1000);

    return (
        <>
            <button onClick={() => {setToNum(num1)}}>To Num 1</button>
            <button onClick={() => {setToNum(num2)}}>To Num 2</button>
            <div className={sandboxStyle['container']}>
                {num}
            </div>
        </>
    );
}

function IntAnimTest() {
    const num1 = 10;
    const num2 = -10;
    const [toNum, setToNum] = useState(num1);

    const num = useIntAnimation(0, toNum, 1000);

    return (
        <>
            <button onClick={() => {setToNum(num1)}}>To Num 1</button>
            <button onClick={() => {setToNum(num2)}}>To Num 2</button>
            <div className={sandboxStyle['container']}>
                {num}
            </div>
        </>
    );
}

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

    console.log(masterExp);
    return (
        <span>
            {styledText}
        </span>
    );
}