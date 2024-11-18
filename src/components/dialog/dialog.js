import Button from "../button/button";
import dialogStyles from "./dialog.module.css"

export default function Dialog({open, enableExit, id=`${Math.random()}`, className='', children}) {

    const onClick = (e) => {
        if (e.currentTarget !== e.target){
            return;
        }

        const dialog = e.target;
        const dialogDimensions = dialog.getBoundingClientRect();
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
          ) {
            dialog.close();
          }
    };

    const onExitClicked = () => {
        const dialog = /**@type {HTMLDialogElement}*/(document.getElementById(id));
        if (!dialog) {
            return;
        }

        dialog.close();
    };
    return (
        <dialog open={open} onClick={onClick} id={id} className={className}>
            {children}
            {enableExit && <Button className={`${dialogStyles['exit-btn']} material-symbols-outlined`} onClick={onExitClicked}>close</Button>}
        </dialog>);
}