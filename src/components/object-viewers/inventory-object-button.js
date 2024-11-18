import Button from "../button/button";
import ObjectButton from "./object-button";

import buttonStyles from "./object-button.module.css"

export default function InventoryObjectButton({pageObject, disableAdd, className='', onAddClicked=() => {}, onClick}) {
    return (
        <ObjectButton bagObject={pageObject} className={`${className}`} onClick={onClick}>
             <Button disabled={disableAdd} className={buttonStyles['inventory-add-btn']} onClick={e => {onAddClicked(); e.stopPropagation();}}>add</Button>
        </ObjectButton>
    );
}