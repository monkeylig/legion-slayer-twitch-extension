import HeaderBar from "./header-bar";

import headerStyle from './header-bar.module.css'
import pageStyles from '@/styles/pages.module.css'

/**
 * 
 * @param {{
 * title?: string,
 * className?: string,
 * onBackClicked?: () => void
 * }} attributes 
 * @returns 
 */
export default function HeaderBarBack({title, className, onBackClicked}) {
    return (
        <HeaderBar title={title} className={className}>
            <div className={pageStyles['horizontal-container-left']}>
                <button className={`${headerStyle['header-bar-btn']} material-symbols-outlined`} onClick={onBackClicked}>arrow_back</button>
            </div>
        </HeaderBar>
    );
}