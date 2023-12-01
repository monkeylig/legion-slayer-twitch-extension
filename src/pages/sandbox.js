import HeaderBar from "@/components/header-bar/header-bar";
import Head from "next/head";
import sandboxStyle from "@/styles/sandbox.module.css"

import useAnimation from "@/utilities/animation/useAnimation"
import { useRef, useState } from "react";
import useTypeWriterAnimation from "@/utilities/animation/useTypeWriterAnimation";
import useNumberAnimation from "@/utilities/animation/useNumberAnimation";
import useIntAnimation from "@/utilities/animation/useIntAnimation";

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

    const onAnimationEnd = () => {
        setDoneText('done')
    };
    const text = useTypeWriterAnimation(animText, 15, onAnimationEnd);

    return (
        <>
            <button onClick={() => {setAnimText(text1)}}>Animation text 1</button>
            <button onClick={() => {setAnimText(text2)}}>Animation text 2</button>
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