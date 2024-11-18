import Button from "../button/button";
import ObjectButton from "./object-button";
import buttonStyles from "./object-button.module.css"

export default function BagObjectButton({bagObject, empty, className='', onMoveClicked=() => {}, onClick}) {
    return (
        <ObjectButton bagObject={bagObject} className={`${className}`} onClick={onClick}>
             {!empty && <Button className={buttonStyles['bag-move-btn']} onClick={(e) => { onMoveClicked(); e.stopPropagation();}}>move</Button>}
        </ObjectButton>
    );
}
