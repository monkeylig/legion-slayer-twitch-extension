import Image from "next/image";
import ObjectButton from "./object-button";

import buttonStyles from "./object-button.module.css"

export default function ShopItemButton({label="Object Name", pricing=50, imageSrc="potion.webp", tilt=false, className='', onClick}) {
    return (
        <ObjectButton tilt={tilt} label={label} imageSrc={imageSrc} className={`${className}`} onClick={onClick}>
            <div className={buttonStyles['pricing']}>
                <span>{pricing}</span>
                <span className={buttonStyles['currency-icon']}><Image src='coin.png' fill></Image></span>
            </div>
        </ObjectButton>
    );
}