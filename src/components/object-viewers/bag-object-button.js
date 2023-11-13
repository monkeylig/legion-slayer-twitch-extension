import Button from "../button/button";
import ObjectButton from "./object-button";

import buttonStyles from "./object-button.module.css"

export default function BagObjectButton({imageSrc="potion.webp",className=''}) {
    return (
        <ObjectButton imageSrc={imageSrc} className={`${className}`}>
             <Button className={buttonStyles['bag-move-btn']}>move</Button>
        </ObjectButton>
    );
}