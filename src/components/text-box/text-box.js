import textBoxStyle from "./text-box.module.css"

export default function TextBox({label='Label', limit, onInput, value, min, max, type='text', className}) {
    return (
        <div className={`${className} ${textBoxStyle['rpg-text-box']}`}>
            <span>{label}</span>
            <input style={{color: "black"}} maxLength={limit ? limit : ""} type={type} required value={value} min={min} max={max} onInput={onInput}/>
        </div>
    );
}