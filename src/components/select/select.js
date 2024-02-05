import selectStyles from "@/components/select/select.module.css"

export default function Select({defaultValue, name='', id='', className='', style={}, children, onChange}) {
    return (
        <select defaultValue={defaultValue} name={name} id={id} className={`${className} ${selectStyles['rpg-select']}`} style={style} onChange={onChange}>
            {children}
        </select>
    );
}