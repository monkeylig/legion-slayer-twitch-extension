import HeaderBar from "./header-bar";

import headerStyle from './header-bar.module.css'

export default function HeaderBarBack({title, className}) {
    return (
        <HeaderBar title={title} className={className}>
            <button className={`${headerStyle['header-bar-back-btn']} material-symbols-outlined`}>arrow_back</button>
        </HeaderBar>
    );
}