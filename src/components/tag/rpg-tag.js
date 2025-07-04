/**
 * @import {CSSProperties} from "react"
 */
import tagStyles from "./rpg-tag.module.css"

/**
 * @param {{
 * style: CSSProperties
 * children: string
 * }} attributes 
 */
function RPGTag({style, children}) {
    return (
        <div className={tagStyles['tag-area']}>
            <div style={style} className={tagStyles['tag-content']}>{children}</div>
        </div>
    );
}

export {RPGTag};
