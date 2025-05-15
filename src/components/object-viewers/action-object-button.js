import AsyncButton from "../button/async-button";
import Button from "../button/button";
import ObjectButton from "./object-button";
import buttonStyles from "./object-button.module.css"

/**
 * 
 * @param {{
 * rpgObject?: Object,
 * empty?: boolean,
 * actionName?: string
 * className?: string,
 * actionButtonClassName?: string,
 * onActionClick?: () => Promise,
 * onClick?: () => void
 * }} attributes 
 * @returns 
 */
function AsyncActionObjectButton({rpgObject, actionName='action', empty, className='', actionButtonClassName='', onActionClick=async () => {}, onClick=() => {}}) {
    const actionClicked = async (e) => {
        e.stopPropagation();
        await onActionClick();
    };
    return (
        <ObjectButton bagObject={rpgObject} empty={empty} className={`${className}`} onClick={onClick}>
             {!empty && <AsyncButton className={`${buttonStyles['action-btn']} ${actionButtonClassName}`} onClick={actionClicked}>{actionName}</AsyncButton>}
        </ObjectButton>
    );
}

export {AsyncActionObjectButton};