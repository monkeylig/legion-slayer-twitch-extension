import Image from "next/image";
import buttonStyles from "./object-button.module.css"

export default function ObjectButton({imageSrc, label='Object Name', tilt=false, className='', onClick, children}) {
    const preventDragHandler = (e) => {
        e.preventDefault();
      }
    const rotateStyle = tilt ? buttonStyles['rotate'] : '';
    return (
    <div className={`${buttonStyles['object-button']} ${className}`} onDragStart={preventDragHandler} onClick={onClick}>
        <div className={`${buttonStyles['icon-container']}`} onDragStart={preventDragHandler}>
            {imageSrc && <Image sizes="65px" alt='image button' className={`${buttonStyles['button-icon']} ${rotateStyle}`} fill src={imageSrc} onDragStart={preventDragHandler}/>}
        </div>
        <div>{label}</div>
        <div style={{position: 'relative'}}>{children}</div>
    </div>
    );
}