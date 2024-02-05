import { useCallback, useEffect, useRef } from "react";

export default function useAnimation(animFunction, isPlaying=true) {
    const startTime = useRef(0);
    const lastTime = useRef(0);
    const animationId = useRef(0);

    const animationTick = useCallback(timestamp => {
        if(!isPlaying) {
            return;
        }
        if(startTime.current === 0) {
            startTime.current = timestamp;
            lastTime.current = timestamp;
        }

        animFunction(timestamp - lastTime.current, timestamp - startTime.current);
        lastTime.current = timestamp;

        animationId.current = window.requestAnimationFrame(animationTick);
    }, [isPlaying, animFunction]); 

    useEffect(()=> {
        animationId.current = window.requestAnimationFrame(animationTick);
        
        return () => {
            window.cancelAnimationFrame(animationId.current);
        }; 
    }, [animationTick]);

    useEffect(() => {
            startTime.current = 0;
            lastTime.current = 0;
    }, [animFunction]);
}