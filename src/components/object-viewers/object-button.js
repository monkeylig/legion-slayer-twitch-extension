import Image from "next/image";
import buttonStyles from "./object-button.module.css"
import battleStyle from "@/styles/battle.module.css"

export default function ObjectButton({bagObject, showCount=true, className='', onClick, children}) {
    if (!bagObject) {
        return;
    }

    const object = bagObject.content ? bagObject.content : bagObject.product;
    if (!object) {
        return;
    }
    
    let count;
    if (object) {
        count = object.count;
    }

    const preventDragHandler = (e) => {
        e.preventDefault();
      }
    const rotateStyle = bagObject.type === 'weapon' ? buttonStyles['rotate'] : '';
    return (
    <div className={`${buttonStyles['object-button']} ${className}`} onDragStart={preventDragHandler} onClick={onClick}>
        {!!count && showCount && 
        <div className={battleStyle['item-count-area']}>
            <div className={battleStyle['item-count']}>{count}</div>
        </div>}
        <div className={`${buttonStyles['icon-container']}`} onDragStart={preventDragHandler}>
            {object.icon && <Image sizes="65px" alt='image button' className={`${buttonStyles['button-icon']} ${rotateStyle}`} fill src={object.icon} onDragStart={preventDragHandler}/>}
        </div>
        <div>{object.name}</div>
        <div style={{position: 'relative'}}>{children}</div>
    </div>
    );
}