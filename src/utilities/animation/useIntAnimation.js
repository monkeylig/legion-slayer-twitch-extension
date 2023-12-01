import { useCallback, useEffect, useRef, useState } from "react";
import useAnimation from "./useAnimation";

export default function useIntAnimation(startNum, endNum, duration, onAnimationEnd) {
    const [num, setNum] = useState(startNum);

    const animTick = useCallback((timeElapsed, totalTime) => {
        const min = Math.min(startNum, endNum);
        const max = Math.max(startNum, endNum);
        const newNum = Math.floor(Math.max(min,
            Math.min(max, startNum + totalTime/duration * (endNum - startNum))));

        if(newNum !== num)
        {
            setNum(Math.floor(newNum));
        }

        if(newNum === endNum) {
            onAnimationEnd?.();
        }
    }, [num, startNum, endNum, duration]);

    useEffect(()=>{
        setNum(startNum);
    }, [startNum]);

    useAnimation(animTick, num !== endNum, [startNum, endNum, duration]);
    return num;
}