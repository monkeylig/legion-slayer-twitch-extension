import colors from '@/utilities/colors';
import statSheetStyles from './stat-sheet.module.css'
import StatSheet from './stat-sheet';

export default function AbilityView({ability, children}) {
    let nameStyle = {
        color: colors.orange,
        fontSize: '1.25em'
    };

    if(ability.type === 'magical') {
        nameStyle.color = colors.blue;
    }

    return (
        <>
            <div className={statSheetStyles['ability-view']}>
                <span style={nameStyle}>{ability.name}</span>
                <span style={{textAlign: 'center'}}>{ability.description}</span>
                {children}
            </div>
            <StatSheet.StatSheet>
                <StatSheet.Row>Type - {ability.type}</StatSheet.Row>
                <StatSheet.Row>Style - {ability.style}</StatSheet.Row>
                <StatSheet.Row>Base Damage - {ability.baseDamage}</StatSheet.Row>
                <StatSheet.Row lastRow>Speed - {ability.speed}</StatSheet.Row>
            </StatSheet.StatSheet>
        </>
    );
}