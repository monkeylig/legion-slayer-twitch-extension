import selectStyles from "@/components/select/select.module.css"

export default function Select({name='', id='', className='', style={}, children, onChange}) {
    return (
        <select name={name} id={id} className={`${className} ${selectStyles['rpg-select']}`} style={style} onChange={onChange}>
            {children}
        </select>
    );
}