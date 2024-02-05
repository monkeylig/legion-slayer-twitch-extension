import Head from 'next/head'
import Image from "next/image";

import HeaderBar from '@/components/header-bar/header-bar'
import MonsterTile from '@/components/object-viewers/monster-tile';
import Button from '@/components/button/button';

import pageStyles from '@/styles/pages.module.css'
import gameStyles from '@/styles/game.module.css'
import MeterBar from '@/components/meter-bar/meter-bar';
import backend from '@/utilities/backend-calls';
import frontendContext from '@/utilities/frontend-context';
import useAsync from '@/utilities/useAsync';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import Dialog from '@/components/dialog/dialog';
import LabeledMeterBar from '@/components/meter-bar/labeled-meter-bar';
import colors from '@/utilities/colors';
import AsyncButton from '@/components/button/async-button';

export default function Game() {
    const joinGame = useCallback(() => backend.joinGame(frontendContext.get().player.id, frontendContext.get().channelId), []);
    const [data, isPending, error] = useAsync(joinGame);

    return (        
        <div>
            {isPending && <h1>Loading Game...</h1>}
            {data && <GameRender game={data}/>}
            {error && <p>Sorry something went wrong. Try refreshing the page.</p>}
        </div>
    );
}

function GameRender({game}) {
    const router = useRouter();
    const player = frontendContext.get().player;
    const monsterTiles = game.monsters.map(monster => {
        const onClick = () => {
            const dialog = document.querySelector(`#m${monster.id}`);
            dialog.showModal();
        }
        return (
            <span key={monster.id}>
                <MonsterTile monster={monster} onClick={onClick}/>
                <MonsterDialog id={`m${monster.id}`} monster={monster} gameId={game.id}/>
            </span>
        );
    });
    return (
        <>
            <Head>
                <title>Legion Slayer</title>
                <meta name="description" content="The current game." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div style={{gap: '15px'}} className={`${pageStyles['page-container-h-center']}`}>
                <HeaderBar title={game.name}/>
                <p style={{textAlign: 'center'}}>Fight endlessly spawning monsters</p>
                <div className={`${pageStyles['horizonal-container']}`}>
                    {monsterTiles}
                </div>
                <div style={{height: '70px'}}></div>
                <div className={gameStyles['game-nav']}>
                    <Button className={`${gameStyles['nav-button']} material-symbols-outlined`} onClick={() => { router.push('/bag') }}>backpack</Button>
                    <button className={`${gameStyles['profile-bar']}`} onClick={() => { router.push('/profile'); }}>
                        <div className={`${gameStyles['profile-avatar']}`}>
                            <Image src={player.avatar} alt='Player avatar' fill/>
                        </div>
                        <div className={`${gameStyles['health-level-container']}`}>
                            <span>Lvl {player.level}</span>
                            <MeterBar progress={player.health/player.maxHealth} className={`${gameStyles['health-bar']}`}/>
                        </div>
                    </button>
                    <Button className={`${gameStyles['nav-button']} material-symbols-outlined`} onClick={() => {router.push('/shop')}}>store</Button>
                </div>
            </div>
        </>
    );
}

function MonsterDialog({monster, id, gameId}) {
    const router = useRouter();

    if(!monster) {
        return;
    }

    const playerId = frontendContext.get().player.id;
    const fallbackMonster = {
        monsterClass: monster.class,
        level: monster.level
    };
    const onFightClicked = async () => {
        const battleState = await backend.startBattle(playerId, gameId, monster.id, fallbackMonster);

        const urlObject = {
            pathname: '/battle',
            query: {
                battleState: JSON.stringify(battleState),
            }
        };
        router.push(urlObject);
    };
    return (
        <Dialog id={id}>
            <div className={gameStyles['monster-dialog']}>
                <div className={gameStyles['monster-avatar']}>
                    <Image alt='Avatar of a monster' fill src={monster.avatar}/>
                </div>
                <span style={{fontSize: '20px'}}>{monster.name}</span>
                <span style={{fontSize: '12px'}}>Level {monster.level}</span>
                <span className={gameStyles['monster-description']}>{monster.description}</span>
                <div className={gameStyles['monster-stats']}>
                    <LabeledMeterBar progress={monster.healthRating} barColor={colors.orange}>Max Health</LabeledMeterBar>
                    <LabeledMeterBar progress={monster.strengthRating} barColor={colors.orange}>Strength</LabeledMeterBar>
                    <LabeledMeterBar progress={monster.magicRating} barColor={colors.orange}>Magic</LabeledMeterBar>
                    <LabeledMeterBar progress={monster.defenseRating} barColor={colors.orange}>Defense</LabeledMeterBar>
                </div>
                <AsyncButton className={gameStyles['fight-btn']} onClick={onFightClicked}>Fight!</AsyncButton>
            </div>
        </Dialog>
    );
}