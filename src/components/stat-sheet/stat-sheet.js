import statSheetStyles from './stat-sheet.module.css'

import Icon from '../icon/icon';

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
* total: number
* }} attributes 
* @returns 
*/
function GrowthStatRow({stat, total, lastRow, children}) {
   const ratio = stat/total;
   let statImage = '/stat_mid.png';
   if (ratio > 0.25) {
       statImage = '/stat_up.png';
   }
   else if (ratio < 0.25) {
       statImage = '/stat_down.png';
   }

   return <Row lastRow={lastRow}><div>{children} <Icon inline width={10} height={10} style={{width: '10px', height: '10px'}} src={statImage}/></div></Row>

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