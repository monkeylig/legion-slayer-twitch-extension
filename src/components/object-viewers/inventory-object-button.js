import Button from "../button/button";
import ObjectButton from "./object-button";

import buttonStyles from "./object-button.module.css"

export default function InventoryObjectButton({imageSrc="potion.webp",className=''}) {
    return (
        <ObjectButton imageSrc={imageSrc} className={`${className}`}>
             <Button className={buttonStyles['inventory-add-btn']}>add</Button>
        </ObjectButton>
    );
}