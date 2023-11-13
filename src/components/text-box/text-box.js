import textBoxStyle from "./text-box.module.css"

export default function TextBox({label='Label', limit, onInput, value}) {
    return (
        <div className={textBoxStyle['rpg-text-box']}>
            <span>{label}</span>
            <input maxLength={limit ? limit : ""} type="text" required value={value} onInput={onInput}/>
        </div>
    );
}