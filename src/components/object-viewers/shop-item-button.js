import Image from "next/image";
import ObjectButton from "./object-button";

import buttonStyles from "./object-button.module.css"

export default function ShopItemButton({imageSrc="potion.webp",className=''}) {
    return (
        <ObjectButton imageSrc={imageSrc} className={`${className}`}>
            <div className={buttonStyles['pricing']}>
                <span>50</span>
                <span className={buttonStyles['currency-icon']}><Image src='coin.png' fill></Image></span>
            </div>
        </ObjectButton>
    );
}