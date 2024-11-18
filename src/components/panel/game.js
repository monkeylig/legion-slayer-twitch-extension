/**
 * @import {MonsterData} from '@/utilities/backend-calls'
 * @import {AgentData} from '@/utilities/backend-calls'
 */

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
import Dialog from '@/components/dialog/dialog';
import LabeledMeterBar from '@/components/meter-bar/labeled-meter-bar';
import colors from '@/utilities/colors';
import AsyncButton from '@/components/button/async-button';
import { useLocation, useNavigate } from 'react-router-dom';
import AbilityView from '../stat-sheet/ability-view';

export default function Game() {
    const location = useLocation();
    const joinGame = useCallback(async () => {
        if(!backend.cache.game || (location.state && location.state.forceRefresh)) {
            return await backend.joinGame(frontendContext.get().player.id, frontendContext.get().channelId)
        }
        return backend.cache.game
    }, [location.state]);
    const [data, isPending, error] = useAsync(joinGame);

    const pendingUI = backend.cache.game ? <GameRender game={backend.cache.game}/> : <h1>Loading Game...</h1>

    return (        
        <div>
            {isPending && pendingUI}
            {data && <GameRender game={data}/>}
            {error && <p>Sorry something went wrong. Try refreshing the page.</p>}
        </div>
    );
}

function GameRender({game}) {
    const navigate = useNavigate();
    const player = frontendContext.get().player;
    const monsterTiles = game.monsters.map((monster, index) => {
        const onClick = () => {
            const dialog = document.querySelector(`#m${monster.id}`);
            dialog.showModal();
        }

        return (
            <span key={monster.id}>
                <MonsterTile monster={monster} onClick={onClick} priority={index < 6}/>
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
                <p style={{textAlign: 'center'}}>{game.description}</p>
                <div className={`${pageStyles['horizonal-container']}`}>
                    {monsterTiles}
                </div>
                <div style={{height: '70px'}}></div>
                <div className={gameStyles['game-nav']}>
                    <Button className={`${gameStyles['nav-button']} material-symbols-outlined`} onClick={() => { navigate('/panel/bag') }}>backpack</Button>
                    <ProfileBar player={player}/>
                    <Button className={`${gameStyles['nav-button']} material-symbols-outlined`} onClick={() => {navigate('/panel/shop')}}>store</Button>
                </div>
            </div>
        </>
    );
}

/**
 * @param {{
 * player: AgentData
 * }} attributes 
 */
function ProfileBar({player}) {
    const navigate = useNavigate();

    if (!player) {
        return;
    }

    const style = player.avatar === 'player_avatar6.webp' ? {top: "auto", bottom: "40px"} : {};
    return (
        <button className={`${gameStyles['profile-bar']}`} onClick={() => { navigate('/panel/profile'); }}>
            <div className={`${gameStyles['profile-avatar']}`}>
                <Image style={style} sizes="56px" src={player.avatar} alt='Player avatar' fill/>
            </div>
            <div className={`${gameStyles['health-level-container']}`}>
                <span style={{color: 'black'}}>Lvl {player.level}</span>
                <MeterBar progress={player.health/player.maxHealth} className={`${gameStyles['health-bar']}`}/>
            </div>
        </button>
    );
}

/**
 * 
 * @param {{
 * monster: MonsterData,
 * id: string,
 * gameId, string
 * }} attributes 
 * @returns 
 */
function MonsterDialog({monster, id, gameId}) {
    const navigate = useNavigate();

    if(!monster) {
        return;
    }

    let health = 1;
    let strength = 1;
    let magic = 1;
    let defense = 1;

    if (monster.talent) {
        health = monster.talent.maxHealth ? monster.talent.maxHealth : health;
        strength = monster.talent.strength ? monster.talent.strength : strength;
        magic = monster.talent.magic ? monster.talent.magic : magic;
        defense = monster.talent.defense ? monster.talent.defense : defense;
    }

    const total = health + strength + magic + defense;

    let abilities;
    if (monster.abilities) {
        abilities = monster.abilities.map((ability, index) => {
            return <AbilityView key={index} ability={ability}></AbilityView>
        });
    }

    const playerId = frontendContext.get().player.id;
    const fallbackMonster = {
        monsterClass: monster.class,
        level: monster.level
    };
    const onFightClicked = async () => {
        const battleState = await backend.startBattle(playerId, gameId, monster.id, fallbackMonster);

        const urlObject = {
                battleState,
        };
        navigate('/panel/battle', { state: urlObject });
    };
    return (
        <Dialog id={id} enableExit>
            <div className={gameStyles['monster-dialog']}>
                <div className={gameStyles['monster-avatar']}>
                    <Image sizes='271px' alt='Avatar of a monster' fill src={monster.avatar}/>
                </div>
                <AsyncButton className={gameStyles['fight-btn']} onClick={onFightClicked}>Fight!</AsyncButton>
                <span style={{fontSize: '20px'}}>{monster.name}</span>
                <span style={{fontSize: '12px'}}>Level {monster.level}</span>
                <span className={gameStyles['monster-description']}>{monster.description}</span>
                <div className={gameStyles['monster-stats']}>
                    <LabeledMeterBar progress={health/total * 1.5} barColor={colors.orange}>Max Health</LabeledMeterBar>
                    <LabeledMeterBar progress={strength/total * 1.5} barColor={colors.orange}>Strength</LabeledMeterBar>
                    <LabeledMeterBar progress={magic/total * 1.5} barColor={colors.orange}>Magic</LabeledMeterBar>
                    <LabeledMeterBar progress={defense/total * 1.5} barColor={colors.orange}>Defense</LabeledMeterBar>
                </div>
                <div className='section-title'>Abilities</div>
                {abilities}
            </div>
        </Dialog>
    );
}