import { useRef } from "react";
import toolTipStyles from "./tooltip.module.css"

export default function Tooltip({id=Math.random().toString(), layout, children}) {
    const timeOutId = useRef(null);


    const showDialog = (event) => {
        const dialog = document.getElementById(id);
        if(!dialog) {
            return;
        }
        var y = event.clientY;
        dialog.show();
        dialog.style.top = `calc(${y}px - ${dialog.offsetHeight}px - 10px)`;
    };

    const mouseEnter = (event) => {
        timeOutId.current = setTimeout(() => {
            showDialog(event);
        }, 500);
    }

    const mouseExit = (event) => {
        clearTimeout(timeOutId.current);
        const dialog = document.getElementById(id);
        if(!dialog) {
            return;
        }
        dialog.close();
    }
    return (
        <span style={{position: 'relative'}} onClick={(event) => showDialog(event)} onMouseEnter={mouseEnter} onMouseLeave={mouseExit}>
            <dialog className={toolTipStyles.tooltip} id={id}>{layout}</dialog>
            <span>{children}</span>
        </span>
    );
}