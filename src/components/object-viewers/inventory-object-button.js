import Button from "../button/button";
import ObjectButton from "./object-button";

import buttonStyles from "./object-button.module.css"

export default function InventoryObjectButton({label, imageSrc, tilt=false, className='', onAddClicked=() => {}, onClick}) {
    return (
        <ObjectButton tilt={tilt} label={label} imageSrc={imageSrc} className={`${className}`} onClick={onClick}>
             <Button className={buttonStyles['inventory-add-btn']} onClick={e => {onAddClicked(); e.stopPropagation();}}>add</Button>
        </ObjectButton>
    );
}