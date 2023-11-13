import Head from 'next/head'

import HeaderBarBack from '@/components/header-bar/header-bar-back'
import Button from '@/components/button/button'
import Select from '@/components/select/select'

import pageStyles from '@/styles/pages.module.css'
import profileStyles from '@/styles/profile.module.css'
import BagObjectButton from '@/components/object-viewers/bag-object-button'
import InventoryObjectButton from '@/components/object-viewers/inventory-object-button'
import Image from 'next/image'
import MeterBar from '@/components/meter-bar/meter-bar'
import colors from '@/utilities/colors'
import StatSheet from '@/components/stat-sheet/stat-sheet'

export default function Profile() {
    const testProfile = {
        name: 'Jhard9000',
        level: 39,
        avatar: 'hero_paladin.webp',
        maxHealth: 100,
        health: 100,
        exp: 100,
        expToNextLevel: 100,
        strength: 30,
        magic: 25,
        defence: 35,
        weapon: {
            icon: 'black_clover.png'
        },
        trackers: {
            weaponKills: {
                sword: 0,
                staff: 0,
                dagger: 0,
            },
            deaths: 0
        },
        abilities: [
            {
                name: 'Ability 1'
            },
            {
                name: 'Ability 2'
            },
            {
                name: 'Ability 3'
            },
            {
                name: 'Ability 4'
            },
            {
                name: 'Ability 5'
            },
        ]
    };

    const abilityRows = testProfile.abilities.map((ability, index) => {
        return <StatSheet.Row lastRow={index === testProfile.abilities.length-1} key={index}>{testProfile.abilities[index].name}</StatSheet.Row>
    });
    return (
        <>
            <Head>
                <title>Profile</title>
                <meta name="description" content="View the player's profile." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            </Head>
            <div className={`${pageStyles['page-container-h-center']}`}>
                <div className={profileStyles['weapon-background']}>
                    <Image style={{objectFit: 'cover'}} src={testProfile.weapon.icon} fill/>
                </div>
                <HeaderBarBack title='Profile'/>
                <div className={profileStyles['profile-view']}>
                    <div className={profileStyles['profile-avatar']}>
                        <Image style={{objectFit: 'cover'}} src={testProfile.avatar} fill/>
                    </div>
                    <div style={{fontSize: '1.5em'}}>{testProfile.name}</div>
                    <div>Level {testProfile.level}</div>
                    <div className={profileStyles['health-exp-container']}>
                        <div>HP</div>
                        <MeterBar progress={testProfile.health/testProfile.maxHealth} className={profileStyles['stat-meter']}>
                            {testProfile.health}/{testProfile.maxHealth}
                        </MeterBar>
                        <div>EXP</div>
                        <MeterBar progress={testProfile.exp/testProfile.expToNextLevel} barColor={colors.blue} className={profileStyles['stat-meter']}>
                            {testProfile.exp}/{testProfile.expToNextLevel}
                        </MeterBar>
                    </div>
                    <StatSheet.StatSheet>
                        <StatSheet.Row>Strength - {testProfile.strength}</StatSheet.Row>
                        <StatSheet.Row>Magic - {testProfile.magic}</StatSheet.Row>
                        <StatSheet.Row lastRow>Defense - {testProfile.defence}</StatSheet.Row>
                    </StatSheet.StatSheet>
                    <StatSheet.StatSheet>
                        <StatSheet.Row>Sword Victories - {testProfile.trackers.weaponKills.sword}</StatSheet.Row>
                        <StatSheet.Row>Staff Victories - {testProfile.trackers.weaponKills.staff}</StatSheet.Row>
                        <StatSheet.Row lastRow>Dagger Victories - {testProfile.trackers.weaponKills.dagger}</StatSheet.Row>
                    </StatSheet.StatSheet>
                    <div>Abilities</div>
                    <StatSheet.StatSheet>
                        {abilityRows}
                    </StatSheet.StatSheet>
                    <div>
                        <div>Weapon</div>
                        <div className={profileStyles['weapon-btn']}><Image className={profileStyles['weapon-img']} src={testProfile.weapon.icon} fill></Image></div>
                    </div>
                </div>
            </div>
        </>
    )
}