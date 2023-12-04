import Image from "next/image";
import ObjectButton from "./object-button";

import buttonStyles from "./object-button.module.css"
import Currency from "../currency/currency";

export default function ShopItemButton({label="Object Name", pricing=50, imageSrc="potion.webp", tilt=false, className='', onClick}) {
    return (
        <ObjectButton tilt={tilt} label={label} imageSrc={imageSrc} className={`${className}`} onClick={onClick}>
            <Currency size={12} className={buttonStyles['pricing']}>{pricing}</Currency>
        </ObjectButton>
    );
}