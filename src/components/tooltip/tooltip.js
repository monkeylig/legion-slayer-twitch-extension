import { useRef } from "react";
import toolTipStyles from "./tooltip.module.css"

export default function Tooltip({id=Math.random().toString(), layout, children}) {
    const timeOutId = useRef(null);


    /**@type {(type: MouseEvent) => void} */
    const showTooltip = (event) => {
        const tooltip = document.getElementById(id);
        if(!tooltip) {
            return;
        }

        tooltip.style.right = `auto`; 
        tooltip.style.left = `50%`;
        tooltip.style.top = 'auto';
        tooltip.style.bottom = '100%';
        tooltip.style.transform = `translateX(-50%)`;
        tooltip.style.display = "block";

        let tooltipRect = tooltip.getBoundingClientRect();
        let getRightBound = () => window.innerWidth - tooltipRect.right;
        let rightBounds = getRightBound();
        let leftBounds = 0;
        let topBounds = 0;
        const dialog = tooltip.closest('dialog');
        if (dialog) {
            const dialogRect = dialog.getBoundingClientRect();
            getRightBound = () => dialogRect.right - tooltipRect.right;
            rightBounds = getRightBound();
            leftBounds = dialogRect.left;
            topBounds = dialogRect.top;
        }

        if (rightBounds < 0) {
            console.log(rightBounds);
            tooltip.style.right = `auto`;
            tooltip.style.left = `0`;
            tooltip.style.transform = `none`;
            tooltipRect = tooltip.getBoundingClientRect();
            rightBounds = getRightBound();
            tooltip.style.transform = `translateX(${rightBounds - 10}px)`;
            tooltipRect = tooltip.getBoundingClientRect();
        }

        if (tooltipRect.top < topBounds) {
            tooltip.style.top = '100%';
            tooltip.style.bottom = 'auto';
        }

        if (tooltipRect.x < leftBounds) {
            tooltip.style.right = `0`;
            tooltip.style.left = `auto`;
            tooltip.style.transform = `none`;
            tooltipRect = tooltip.getBoundingClientRect();
            tooltip.style.transform = `translateX(${leftBounds - tooltipRect.x + 5}px)`;
        }

        tooltip.style.visibility = 'visible';

        // var y = event.clientY;
        // dialog.show();
        // dialog.style.top = `calc(${y}px - ${dialog.offsetHeight}px - 10px)`;
    };

    const mouseEnter = (event) => {
        timeOutId.current = setTimeout(() => {
            showTooltip(event);
        }, 500);
    }

    const mouseExit = (event) => {
        clearTimeout(timeOutId.current);
        const tooltip = document.getElementById(id);
        if(!tooltip) {
            return;
        }
        
        tooltip.style.visibility = 'hidden';
        tooltip.style.display = "none";

    }
    return (
        <span className={toolTipStyles['tooltip-container']} onClick={(event) => showTooltip(event)} onMouseEnter={mouseEnter} onMouseLeave={mouseExit}>
            <div className={toolTipStyles.tooltip} id={id}>{layout}</div>
            {children}
        </span>
    );
}