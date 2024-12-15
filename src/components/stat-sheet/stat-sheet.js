import statSheetStyles from './stat-sheet.module.css'

import Icon from '../icon/icon';
import Tooltip from '../tooltip/tooltip';

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

/**
 * 
 * @param {{
* stat: number,
* total: number,
* statName: string
* }} attributes 
* @returns 
*/
function GrowthStatRow({stat, total, statName, lastRow, children}) {
    const ratio = stat/total;
    let statImage = './stat_mid.png';
    if (ratio > 0.25) {
        statImage = './stat_up.png';
    }
    else if (ratio < 0.25) {
        statImage = './stat_down.png';
    }

    const HelpUi = () => {
        return (
            <>
                {statImage === './stat_mid.png' && <div className='dialog-frame'>Your {children} will grow at average speed after leveling up.</div>}
                {statImage === './stat_up.png' && <div className='dialog-frame'>Your {children} will grow faster than normal after leveling up.</div>}
                {statImage === './stat_down.png' && <div className='dialog-frame'>Your {children} will grow slower than normal after leveling up.</div>}
            </>);
    }
<div className='dialog-frame'>
                Your {children} will grow slower after leveling up.
            </div>
    return (
        <Row lastRow={lastRow}>
            <Tooltip layout={HelpUi()}><div>{children} <Icon inline width={10} height={10} style={{width: '10px', height: '10px'}} src={statImage}/></div></Tooltip>
        </Row>);
}

/**
* 
* @param {{
* growthObject: GrowthObject
* }} attributes 
*/
function StatGrowthTable({growthObject}) {
   const total = growthObject.maxHealth + growthObject.strength + growthObject.magic + growthObject.defense;

   return (
   <>
       <StatSheet>
           <GrowthStatRow stat={growthObject.maxHealth} total={total}>Max Health</GrowthStatRow>
           <GrowthStatRow stat={growthObject.strength} total={total}>Strength</GrowthStatRow>
           <GrowthStatRow stat={growthObject.magic} total={total}>Magic</GrowthStatRow>
           <GrowthStatRow lastRow stat={growthObject.defense} total={total}>Defense</GrowthStatRow>
       </StatSheet>
   </>
   );
}

const statSheet = {
    StatSheet,
    Row,
    GrowthStatRow,
    StatGrowthTable,
};

export default statSheet;