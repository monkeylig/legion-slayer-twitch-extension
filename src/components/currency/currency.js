import Icon from "../icon/icon";
import currencyStyle from "./currency.module.css"

export default function Currency({size=16, children}) {
    const textStyle = {
        fontSize: `${size}px`
    };

    const iconStyle = {
        height: `${size+2}px`,
        width: `${size+2}px`
    }
    return (
        <span className={currencyStyle['currency']}>
            <Icon style={iconStyle} src='coin.webp'/>
            <span style={textStyle}>{children}</span>
        </span>
    );
}