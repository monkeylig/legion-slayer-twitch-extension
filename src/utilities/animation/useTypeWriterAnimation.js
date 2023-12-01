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

        if(animString !== currentString) {
            setAnimString(currentString);
        }

        if(currentString === finalString) {
            onAnimationEnd?.();
        }
    }, [animString, charsPerSecond, finalString, onAnimationEnd]);



    useAnimation(animTick, animString !== finalString, [finalString]);

    return animString;
}