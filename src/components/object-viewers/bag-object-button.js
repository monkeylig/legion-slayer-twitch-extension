import AsyncButton from "../button/async-button";
import Button from "../button/button";
import ObjectButton from "./object-button";
import buttonStyles from "./object-button.module.css"

/**
 * 
 * @param {{
 * bagObject: Object,
 * empty: boolean,
 * className: string,
 * onMoveClicked: () => Promise,
 * onClick: () => void
 * }} attributes 
 * @returns 
 */
export default function BagObjectButton({bagObject, empty, className='', onMoveClicked=async () => {}, onClick=() => {}}) {
    const moveClicked = async (e) => {
        e.stopPropagation();
        await onMoveClicked();
    };
    return (
        <ObjectButton bagObject={bagObject} empty={empty} className={`${className}`} onClick={onClick}>
             {!empty && <AsyncButton className={buttonStyles['bag-move-btn']} onClick={moveClicked}>move</AsyncButton>}
        </ObjectButton>
    );
}
