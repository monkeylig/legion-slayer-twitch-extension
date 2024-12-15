import HeaderBar from "./header-bar";

import headerStyle from './header-bar.module.css'

export default function HeaderBarBack({title, className, onBackClicked}) {
    return (
        <HeaderBar title={title} className={className}>
            <button className={`${headerStyle['header-bar-btn']} material-symbols-outlined`} onClick={onBackClicked}>arrow_back</button>
        </HeaderBar>
    );
}