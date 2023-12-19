import Image from "next/image";
import iconStyle from "./icon.module.css"

export default function Icon({src, alt='icon', style={}, className=''}) {
    return (
        <div style={style} className={`${iconStyle.icon} ${className}`}>
            <Image alt={alt} fill src={src}/>
        </div>
    );
}