import Button from "../button/button";
import ObjectButton from "./object-button";

import buttonStyles from "./object-button.module.css"

export default function BagObjectButton({label='Bag Object', imageSrc, empty, tilt=false, className='', onMoveClicked=() => {}, onClick}) {
    return (
        <ObjectButton tilt={tilt} label={empty ? '' : label} imageSrc={imageSrc} className={`${className}`} onClick={onClick}>
             {!empty && <Button className={buttonStyles['bag-move-btn']} onClick={(e) => { onMoveClicked(); e.stopPropagation();}}>move</Button>}
        </ObjectButton>
    );
}