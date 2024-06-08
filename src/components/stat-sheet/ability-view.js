import colors from '@/utilities/colors';
import statSheetStyles from './stat-sheet.module.css'
import StatSheet from './stat-sheet';
import RPGText from '../text/text';
import { useRef } from 'react';
import Tooltip from '../tooltip/tooltip';
import KeywordText from '../text/keyword-text';

export default function AbilityView({ability, children}) {
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
                <StatSheet.Row>Base Damage - {`${ability.baseDamage}${ability.baseDamageTextModifier ? ability.baseDamageTextModifier : ''}`}</StatSheet.Row>
                <StatSheet.Row><span>Elements - {elements}</span></StatSheet.Row>
                <StatSheet.Row lastRow>Speed - {ability.speed}</StatSheet.Row>
            </StatSheet.StatSheet>
        </>
    );
}
