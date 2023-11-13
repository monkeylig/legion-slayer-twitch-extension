import headerStyle from './header-bar.module.css'

export default function HeaderBar({title, children}) {
    return (
        <div className={headerStyle['header-bar']}>
            <div className={headerStyle['header-bar-title-containter']}>
                <p>{title}</p>
            </div>
            {children}
        </div>
    );
}