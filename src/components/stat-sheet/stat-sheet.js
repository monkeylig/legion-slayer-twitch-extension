import statSheetStyles from './stat-sheet.module.css'

import statUpImage from '../../../public/stat_up.png'
import statDownImage from '../../../public/stat_down.png'
import statMidImage from '../../../public/stat_mid.png'
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
   let statImage = statMidImage;
   if (ratio > 0.25) {
       statImage = statUpImage;
   }
   else if (ratio < 0.25) {
       statImage = statDownImage;
   }

   return <Row lastRow={lastRow}><div>{children} <Icon inline style={{width: '10px', height: '10px'}} src={statImage}/></div></Row>

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