import radioGroupStyles from './radio-group.module.css'

export default function RadioGroup({className='', inputClassName='', labelClassName='', groupId, options, onChange}) {
    const uiOptions = [];

    const preventDragHandler = (e) => {
        e.preventDefault();
      }
    options.forEach((option, index) => {
        const radioInput = <input className={`${inputClassName} ${radioGroupStyles['invisible']}`} defaultChecked={option.checked} key={`input-${index}`}
                            id={`${groupId}-${index}`} type="radio" name="menu" value={option.value} onChange={onChange} onDragStart={preventDragHandler}/>;
        const radioLabel = <label className={`${labelClassName}`} key={`btn-${index}`} htmlFor={`${groupId}-${index}`} onDragStart={preventDragHandler}>{option.UI}</label>
        uiOptions.push(radioInput, radioLabel);
    });

    return (
        <div className={className} onDragStart={preventDragHandler}>
            {uiOptions}
        </div>
    );
}