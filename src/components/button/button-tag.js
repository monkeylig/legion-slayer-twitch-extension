// @ts-check
/**
 * @import {MouseEventHandler} from 'react'
 */
import buttonStyle from './button.module.css'


/**
 * 
 * @param {{
 *     onClick?: MouseEventHandler<HTMLButtonElement>,
 *     id?: string
 *     className?: string,
 *     children?: any
 * }} attributes 
 */
export default function ButtonTag({onClick, id, className, children}) {
    return <button onClick={onClick} id={id}className={`${className} ${buttonStyle['button-tag']}`}>{children}</button>
}
