import Button from "../button/button";
import ObjectButton from "./object-button";

import buttonStyles from "./object-button.module.css"

export default function ClaimObjectButton({label='Claim Object', imageSrc, empty, tilt=false, className='', onClaimClicked, onClick}) {
    return (
        <ObjectButton tilt={tilt} label={empty ? '' : label} imageSrc={imageSrc} className={`${className}`} onClick={onClick}>
             {!empty && <Button className={buttonStyles['bag-claim-btn']} onClick={(e) => { onClaimClicked?.(); e.stopPropagation();}}>claim</Button>}
        </ObjectButton>
    );
}