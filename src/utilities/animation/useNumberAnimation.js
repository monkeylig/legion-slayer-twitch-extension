import { useCallback, useRef, useState } from "react";
import useAnimation from "./useAnimation";

export default function useNumberAnimation(startNum, endNum, duration) {
    const [num, setNum] = useState(startNum);

    const animTick = useCallback((timeElapsed, totalTime) => {
        const min = Math.min(startNum, endNum);
        const max = Math.max(startNum, endNum);
        const newNum = Math.max(min,
            Math.min(max, startNum + totalTime/duration * (endNum - startNum)));
        setNum(newNum);
    }, [num, startNum, endNum, duration]);

    useAnimation(animTick, num != endNum, [startNum, endNum, duration]);
    return num;
}