/**
 * @import ChildProp from "next/dist/server/app-render/types"
 */

import Button from "../button/button";
import dialogStyles from "./dialog.module.css"

/**
 * 
 * @param {{
 * open: boolean,
 * enableExit: boolean,
 * id: string,
 * onClose: () => void,
 * className: string,
 * style: StylePropertyMap,
 * children: ChildProp
 * }} attribute 
 * @returns 
 */
export default function Dialog({open, enableExit, id=`${Math.random()}`, onClose, className='', style, children}) {

    const onClick = (e) => {
        if (e.currentTarget !== e.target){
            return;
        }

        const dialog = e.target;
        const dialogDimensions = dialog.getBoundingClientRect();
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
          ) {
            dialog.close();
            onClose();
          }
    };

    const onExitClicked = () => {
        const dialog = /**@type {HTMLDialogElement}*/(document.getElementById(id));
        if (!dialog) {
            return;
        }
        dialog.close();
        onClose();
    };
    return (
        <dialog open={open} onClick={onClick} id={id} className={className} style={style}>
            {children}
            {enableExit && <Button className={`${dialogStyles['exit-btn']} material-symbols-outlined`} onClick={onExitClicked}>close</Button>}
        </dialog>);
}