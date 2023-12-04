import { useCallback, useEffect, useState } from "react";
import Button from "./button";
import buttonStyle from './button.module.css'

export default function AsyncButton({disabled, className='', style={}, onClick, children}) {
    const [inputDelayOn, setInputDelayOn] = useState(false);
    const [content, setContent] = useState(children);

    const asyncOnClick = () => {
        if(!onClick) {
            return;
        }
        
        setInputDelayOn(true);
        setContent('pending');

        Promise.resolve(onClick())
        .then(() => {
            setTimeout(() => {
                setInputDelayOn(false);
                setContent(children);
            }, 1000);
            setContent('done');
        })
        .catch((error) => {
            setTimeout(() => {
                setInputDelayOn(false);
                setContent(children);
            }, 1000);
            setContent('error');
        });
    };

    useEffect(() => {
        if(!inputDelayOn) {
            setContent(children);
        }
    }, [inputDelayOn, children]);

    let stateClass;
    switch(content) {
        case 'pending':
            stateClass = `${buttonStyle['pending-button']} material-symbols-outlined`;
            break;
        case 'done':
            stateClass = `${buttonStyle['done-button']} material-symbols-outlined`;
            break;
        case 'error':
            stateClass = `${buttonStyle['error-button']} material-symbols-outlined`;
            break;
    }

    return <Button disabled={disabled} className={`${stateClass} ${buttonStyle['rpg-button']} ${className}`} style={style} onClick={asyncOnClick}>{content}</Button>
}