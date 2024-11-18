import Button from "../button/button";
import ObjectButton from "./object-button";

import buttonStyles from "./object-button.module.css"

export default function ClaimObjectButton({object, empty, className='', onClaimClicked, onClick}) {
    return (
        <ObjectButton bagObject={object} className={`${className}`} onClick={onClick}>
             {!empty && <Button className={buttonStyles['bag-claim-btn']} onClick={(e) => { onClaimClicked?.(); e.stopPropagation();}}>claim</Button>}
        </ObjectButton>
    );
}