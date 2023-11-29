import { useCallback, useRef, useState } from "react";
import useAnimation from "./useAnimation";

export default function useTypeWriterAnimation(finalString, charsPerSecond=5) {
    const [animString, setAnimString] = useState('');

    const animTick = useCallback((elapsedTime, totalTime) => {
        const numOfChars = Math.min(Math.floor(totalTime / 1000 * charsPerSecond), finalString.length);
        const currentString = finalString.substring(0, numOfChars);

        if(animString !== currentString) {
            setAnimString(currentString);
        }
    }, [animString, charsPerSecond, finalString]);



    useAnimation(animTick, animString !== finalString, [finalString]);

    return animString;
}