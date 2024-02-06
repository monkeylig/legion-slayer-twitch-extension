import { useCallback, useRef, useState } from "react";
import useAnimation from "./useAnimation";

export default function useTypeWriterAnimation(finalString, charsPerSecond=5, onAnimationEnd) {
    const [animString, setAnimString] = useState('');

    const animTick = useCallback((elapsedTime, totalTime) => {
        if (!finalString) {
            return;
        }
        const numOfChars = Math.min(Math.floor(totalTime / 1000 * charsPerSecond), finalString.length);
        const currentString = finalString.substring(0, numOfChars);

        setAnimString(currentString);

        if(currentString === finalString) {
            onAnimationEnd?.();
        }
    }, [charsPerSecond, finalString, onAnimationEnd]);

    useAnimation(animTick, animString !== finalString);

    return animString;
}

/*
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
*/