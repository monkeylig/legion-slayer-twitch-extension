import Image from "next/image";
import iconStyle from "./icon.module.css"

export default function Icon({src, alt='icon', inline, style={}, className=''}) {
    return (
        <div style={style} className={`${iconStyle.icon} ${className}`}>
            {inline && <Image alt={alt} style={{position: 'relative'}} className={iconStyle['inline']} src={src}/>}
            {!inline && <Image alt={alt} fill src={src}/>}
        </div>
    );
}