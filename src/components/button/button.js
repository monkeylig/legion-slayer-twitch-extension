import buttonStyle from './button.module.css'

/**
 * 
 * @param {{
 * className?: string,
 * style?: object,
 * disabled?: boolean,
 * onClick?: () => void
 * children?: any
 * }} attributes 
 * @returns 
 */
export default function Button({className='', style={}, disabled, onClick, children}) {
    return (
        <>
            {!disabled && <button style={style} onClick={onClick} className={`${buttonStyle['rpg-button']} ${className}`}>{children}</button>}
            {disabled && <button style={style} className={`${buttonStyle['rpg-button']} ${buttonStyle['disabled']} ${className}`}>{children}</button>}
        </>
        );
}