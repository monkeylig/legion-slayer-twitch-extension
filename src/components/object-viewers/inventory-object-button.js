import AsyncButton from "../button/async-button";
import Button from "../button/button";
import ObjectButton from "./object-button";

import buttonStyles from "./object-button.module.css"

/**
 * 
 * @param {{
 * pageObject: Object,
 * disableAdd: boolean,
 * className: string,
 * onAddClicked: () => Promise,
 * onClick: () => Promise
 * }} attributes 
 * @returns 
 */
export default function InventoryObjectButton({pageObject, disableAdd, className='', onAddClicked=() => {}, onClick}) {
    const addedClick = async (e) => {
        e.stopPropagation();
        await onAddClicked();
    };
    return (
        <ObjectButton bagObject={pageObject} className={`${className}`} onClick={onClick}>
             <AsyncButton disabled={disableAdd} className={buttonStyles['inventory-add-btn']} onClick={addedClick}>add</AsyncButton>
        </ObjectButton>
    );
}