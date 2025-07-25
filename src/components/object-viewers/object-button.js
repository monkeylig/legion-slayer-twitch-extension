import Image from "next/image";
import buttonStyles from "./object-button.module.css"
import battleStyle from "@/styles/battle.module.css"
import { RPGTag } from "../tag/rpg-tag";

/**
 * 
 * @param {{
 * bagObject?: any,
 * showCount?: boolean,
 * tag?: any,
 * empty?: boolean,
 * className?: string,
 * onClick?: any,
 * children?: any
 * }} param0 
 * @returns 
 */
export default function ObjectButton({bagObject, showCount=true, tag, empty=false, className='', onClick, children}) {
    const preventDragHandler = (e) => {
        e.preventDefault();
    }

    if (empty) {
        return <div className={`${buttonStyles['object-button']} ${className}`} onDragStart={preventDragHandler} onClick={onClick}/>
    }

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

    const rotateStyle = bagObject.type === 'weapon' ? buttonStyles['rotate'] : '';
    return (
    <div className={`${buttonStyles['object-button']} ${className}`} onDragStart={preventDragHandler} onClick={onClick}>
        {!!count && showCount && <RPGTag>{count}</RPGTag>}
        {tag && <RPGTag>{tag}</RPGTag>}
        <div className={`${buttonStyles['icon-container']}`} onDragStart={preventDragHandler}>
            {object.icon && <Image sizes="65px" alt='image button' className={`${buttonStyles['button-icon']} ${rotateStyle}`} fill src={object.icon} onDragStart={preventDragHandler}/>}
        </div>
        <div>{object.name}</div>
        <div style={{position: 'relative'}}>{children}</div>
    </div>
    );
}