export default function Dialog({open, id='', className='', children}) {

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
    return <dialog open={open} onClick={onClick} id={id} className={className}>{children}</dialog>
}