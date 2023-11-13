import Image from "next/image";
import buttonStyles from "./object-button.module.css"

export default function ObjectButton({imageSrc='gladius_maximus.png', tilt=false, className='', children}) {
    const preventDragHandler = (e) => {
        e.preventDefault();
      }

    const rotateStyle = tilt ? buttonStyles['rotate'] : '';
    return (
    <div className={`${buttonStyles['object-button']} ${className}`} onDragStart={preventDragHandler}>
        <div className={`${buttonStyles['icon-container']}`} onDragStart={preventDragHandler}>
            <Image alt='image button' className={`${buttonStyles['button-icon']} ${rotateStyle}`} fill src={imageSrc} onDragStart={preventDragHandler}/>
        </div>
        <div>Object Name</div>
        {children}
    </div>
    );
}