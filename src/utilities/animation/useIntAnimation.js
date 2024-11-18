import { useCallback, useEffect, useRef, useState } from "react";
import useAnimation from "./useAnimation";

export default function useIntAnimation(startNum, endNum, duration, onAnimationEnd, loop=false) {
    const [num, setNum] = useState(startNum);
    const [animEnded, setAnimEnded] = useState(false);

    const animTick = useCallback((timeElapsed, totalTime) => {
        if(animEnded) {
            return;
        }

        const min = Math.min(startNum, endNum);
        const max = Math.max(startNum, endNum);
        const newNum = Math.floor(Math.max(min,
            Math.min(max, startNum + totalTime/duration * (endNum - startNum))));

        setNum(newNum);

        if(newNum === endNum) {
            onAnimationEnd?.();
            setAnimEnded(true);
        }
    }, [startNum, endNum, duration, onAnimationEnd, animEnded]);

    useEffect(()=> {
        if(loop && animEnded) {
            setAnimEnded(false);
            setNum(startNum);
        }
    }, [animEnded, loop, startNum]);

    useAnimation(animTick, num !== endNum);
    return num;
}