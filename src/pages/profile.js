import Head from 'next/head'

import HeaderBarBack from '@/components/header-bar/header-bar-back'

import pageStyles from '@/styles/pages.module.css'
import profileStyles from '@/styles/profile.module.css'
import Image from 'next/image'
import MeterBar from '@/components/meter-bar/meter-bar'
import colors from '@/utilities/colors'
import StatSheet from '@/components/stat-sheet/stat-sheet'
import { useRouter } from 'next/router'
import frontendContext from '@/utilities/frontend-context'
import AbilityView from '@/components/stat-sheet/ability-view'

export default function Profile() {
    const router = useRouter();
    const player = frontendContext.get().player;
    const weaponViewURL = {
        pathname: '/object-view',
        query: {
            object: JSON.stringify({
                type: 'weapon',
                content: player.weapon
            }),
            mode: 'bag'
        }
    };

    const abilityRows = player.abilities.map((ability, index) => {
        return <AbilityView ability={ability} key={index}/>
    });
    return (
        <>
            <Head>
                <title>Profile</title>
                <meta name="description" content="View the player's profile." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={`${pageStyles['page-container-h-center']}`}>
                <div className={profileStyles['weapon-background']}>
                    <Image alt='current player weapon' style={{objectFit: 'contain'}} src={player.weapon.icon} fill/>
                </div>
                <HeaderBarBack title='Profile' onBackClicked={() => { router.back(); }}/>
                <div className={profileStyles['profile-view']}>
                    <div className={profileStyles['profile-avatar']}>
                        <Image alt="player's avater" style={{objectFit: 'cover'}} src={player.avatar} fill/>
                    </div>
                    <div style={{fontSize: '1.5em'}}>{player.name}</div>
                    <div>Level {player.level}</div>
                    <div className={profileStyles['health-exp-container']}>
                        <div className={profileStyles['labeled-bar']}>
                            <div className={profileStyles['meter-label']}>
                                <div>HP</div>
                                <div className={profileStyles['bar-value']}>{player.health}/{player.maxHealth}</div>
                            </div>
                            <MeterBar progress={player.health/player.maxHealth} className={profileStyles['stat-meter']}/>
                        </div>
                        <div className={profileStyles['labeled-bar']}>
                            <div className={profileStyles['meter-label']}>
                                <div>EXP</div>
                                <div className={profileStyles['bar-value']}>{player.exp}/{player.expToNextLevel}</div>
                            </div>
                            <MeterBar progress={player.exp/player.expToNextLevel} barColor={colors.blue} className={profileStyles['stat-meter']}/>
                        </div>
                    </div>
                    <StatSheet.StatSheet>
                        <StatSheet.Row>Strength - {player.strength}</StatSheet.Row>
                        <StatSheet.Row>Magic - {player.magic}</StatSheet.Row>
                        <StatSheet.Row lastRow>Defense - {player.defense}</StatSheet.Row>
                    </StatSheet.StatSheet>
                    <StatSheet.StatSheet>
                        <StatSheet.Row>Sword Victories - {player.trackers.weaponKills.sword}</StatSheet.Row>
                        <StatSheet.Row>Staff Victories - {player.trackers.weaponKills.staff}</StatSheet.Row>
                        <StatSheet.Row>Dagger Victories - {player.trackers.weaponKills.dagger}</StatSheet.Row>
                        <StatSheet.Row lastRow>Defeats - {player.trackers.deaths}</StatSheet.Row>
                    </StatSheet.StatSheet>
                    {abilityRows.length > 0 && <div className={profileStyles['section-title']}>Abilities</div>}
                    {abilityRows}
                    <div>
                        <div className={profileStyles['section-title']}>Weapon</div>
                        <button onClick={() => router.push(weaponViewURL)} className={profileStyles['weapon-btn']}><Image alt='current player weapon' className={profileStyles['weapon-img']} src={player.weapon.icon} fill></Image></button>
                    </div>
                </div>
            </div>
        </>
    )
}