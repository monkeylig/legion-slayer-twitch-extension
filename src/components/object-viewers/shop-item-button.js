import Image from "next/image";
import ObjectButton from "./object-button";

import buttonStyles from "./object-button.module.css"
import Currency from "../currency/currency";

export default function ShopItemButton({shopItem, pricing=50, className='', onClick}) {
    return (
        <ObjectButton bagObject={shopItem} showCount={false} className={`${className}`} onClick={onClick}>
            <Currency size={12} className={buttonStyles['pricing']}>{pricing}</Currency>
        </ObjectButton>
    );
}