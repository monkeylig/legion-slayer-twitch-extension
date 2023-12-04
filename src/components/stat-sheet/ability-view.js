import colors from '@/utilities/colors';
import statSheetStyles from './stat-sheet.module.css'
import StatSheet from './stat-sheet';

export default function AbilityView({ability, children}) {
    let nameStyle = {
        fontSize: '1.25em'
    };

    const elements = !ability.elements || ability.elements.length === 0 ? 'None' : ability.elements.map((element, index) => {
        const elementText = index === ability.elements.length -1 ? element : `${element}/`;
        
        return <span key={element} style={{color: colors.getElementalColor(element)}}>{`${elementText}`}</span>;
    });

    return (
        <>
            <div className={statSheetStyles['ability-view']}>
                <span className={statSheetStyles['ability-title']}>{ability.name}</span>
                <span style={{textAlign: 'center'}}>{ability.description}</span>
                {children}
            </div>
            <StatSheet.StatSheet>
                <StatSheet.Row>Type - {ability.type}</StatSheet.Row>
                <StatSheet.Row>Style - {ability.style}</StatSheet.Row>
                <StatSheet.Row>Base Damage - {ability.baseDamage}</StatSheet.Row>
                <StatSheet.Row><span>Elements - {elements}</span></StatSheet.Row>
                <StatSheet.Row lastRow>Speed - {ability.speed}</StatSheet.Row>
            </StatSheet.StatSheet>
        </>
    );
}