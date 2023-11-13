import buttonStyle from './button.module.css'

export default function Button({className='', style={}, onClick, children}) {
    return <button style={style} onClick={onClick} className={`${buttonStyle['rpg-button']} ${className}`}>{children}</button>;
}