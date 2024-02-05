import { useCallback, useEffect, useRef, useState } from "react";
import useAnimation from "./useAnimation";

export default function useIntAnimation(startNum, endNum, duration, onAnimationEnd) {
    const [num, setNum] = useState(startNum);

    const animTick = useCallback((timeElapsed, totalTime) => {
        const min = Math.min(startNum, endNum);
        const max = Math.max(startNum, endNum);
        const newNum = Math.floor(Math.max(min,
            Math.min(max, startNum + totalTime/duration * (endNum - startNum))));

        setNum(newNum);

        if(newNum === endNum) {
            onAnimationEnd?.();
        }
    }, [startNum, endNum, duration, onAnimationEnd]);

    useAnimation(animTick, num !== endNum);
    return num;
}