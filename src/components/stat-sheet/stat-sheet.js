import statSheetStyles from './stat-sheet.module.css'

function StatSheet({className='', children}) {
    return (
        <div className={`${statSheetStyles['stat-sheet']} ${className}`}>
            {children}
        </div>
    );
}

function Row({lastRow, className='', children}) {
    return (
        <>
            <div className={`${statSheetStyles['stat-sheet-row']} ${className}`}>
                {children}
                { !lastRow && <div className={statSheetStyles['stat-separator']}/>}
            </div>
        </>
    );
}

export default {
    StatSheet,
    Row
};