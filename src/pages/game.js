import Head from 'next/head'
import Image from "next/image";

import HeaderBar from '@/components/header-bar/header-bar'
import MonsterTile from '@/components/object-viewers/monster-tile';
import Button from '@/components/button/button';

import pageStyles from '@/styles/pages.module.css'
import gameStyles from '@/styles/game.module.css'
import MeterBar from '@/components/meter-bar/meter-bar';

export default function Game() {
    return (
        <>
            <Head>
                <title>Legion Slayer</title>
                <meta name="description" content="The current game." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            </Head>
            <div style={{gap: '15px'}} className={`${pageStyles['page-container-h-center']}`}>
                <HeaderBar title='Arena'/>
                <p style={{textAlign: 'center'}}>Fight endlessly spawning monsters</p>
                <div className={`${pageStyles['horizonal-container']}`}>
                    <MonsterTile/>
                    <MonsterTile/>
                    <MonsterTile/>
                    <MonsterTile/>
                    <MonsterTile/>
                </div>
                <div className={gameStyles['game-nav']}>
                    <Button className={`${gameStyles['nav-button']} material-symbols-outlined`}>backpack</Button>
                    <button className={`${gameStyles['profile-bar']}`}>
                        <div className={`${gameStyles['profile-avatar']}`}>
                            <Image src='hero_paladin.webp' fill/>
                        </div>
                        <div className={`${gameStyles['health-level-container']}`}>
                            <span>Lvl 40</span>
                            <MeterBar className={`${gameStyles['health-bar']}`}/>
                        </div>
                    </button>
                    <Button className={`${gameStyles['nav-button']} material-symbols-outlined`}>store</Button>
                </div>
            </div>
        </>
    );
}