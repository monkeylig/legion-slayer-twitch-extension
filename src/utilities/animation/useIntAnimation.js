import { useCallback, useRef, useState } from "react";
import useAnimation from "./useAnimation";

export default function useIntAnimation(startNum, endNum, duration) {
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
    }, [num, startNum, endNum, duration]);

    useAnimation(animTick, num != endNum, [startNum, endNum, duration]);
    return num;
}