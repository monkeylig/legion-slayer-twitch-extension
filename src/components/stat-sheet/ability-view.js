/**
 * @import {AbilityData} from '@/utilities/backend-calls'
 */

import colors from '@/utilities/colors';
import statSheetStyles from './stat-sheet.module.css'
import StatSheet from './stat-sheet';
import KeywordText from '../text/keyword-text';
import { calcAbilityGrowStats } from '@/utilities/game-stats';

/**
 * 
 * @param {{
 * ability: AbilityData
 * }} attributes 
 * @returns 
 */
export default function AbilityView({ability, showStatGrowth, children}) {
    const elements = !ability.elements || ability.elements.length === 0 ? 'None' : ability.elements.map((element, index) => {
        const elementText = index === ability.elements.length -1 ? element : `${element} `;
        
        return <span key={element} style={{color: colors.getElementalColor(element)}}>{`${elementText}`}</span>;
    });

    return (
        <>
            <div className={statSheetStyles['ability-view']}>
                <span className={statSheetStyles['ability-title']}>{ability.name}</span>
                <KeywordText style={{textAlign: 'center'}}>{ability.description}</KeywordText>
                {children}
            </div>
            <StatSheet.StatSheet>
                <StatSheet.Row>Type - {ability.type}</StatSheet.Row>
                <StatSheet.Row>Style - {ability.style}</StatSheet.Row>
                {ability.apCost !== undefined && <StatSheet.Row>Ap Cost - {ability.apCost}</StatSheet.Row>}
                <StatSheet.Row>Base Damage - {`${ability.baseDamage ? ability.baseDamage : 0}${ability.baseDamageTextModifier ? ability.baseDamageTextModifier : ''}`}</StatSheet.Row>
                <StatSheet.Row><span>Elements - {elements}</span></StatSheet.Row>
                <StatSheet.Row lastRow>Speed - {ability.speed}</StatSheet.Row>
            </StatSheet.StatSheet>
            {showStatGrowth && <StatSheet.StatGrowthTable growthObject={calcAbilityGrowStats(ability)}/>}
        </>
    );
}
