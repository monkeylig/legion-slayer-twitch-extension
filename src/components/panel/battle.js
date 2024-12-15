/**
 * @import {AddEffectStep, ApChangeStep, MaxApChangeStep, ProtectionStep, RemoveEffectStep} from "@/utilities/battle-step-types"
 * @import {BattleData, EffectData, AbilityData} from "@/utilities/backend-calls"
 * @import {BattleAgentData} from "@/utilities/backend-calls"
 */

import Head from "next/head";
import battleStyle from "@/styles/battle.module.css"
import Image from "next/image";
import LabeledMeterBar from "@/components/meter-bar/labeled-meter-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/button/button";
import colors from "@/utilities/colors";
import AsyncButton from "@/components/button/async-button";
import backend from "@/utilities/backend-calls";
import useTypeWriterAnimation from "@/utilities/animation/useTypeWriterAnimation";
import Dialog from "@/components/dialog/dialog";
import getGameTip from "@/utilities/get-game-tip";
import useIntAnimation from "@/utilities/animation/useIntAnimation";
import useNumberAnimation from "@/utilities/animation/useNumberAnimation";
import { resolve } from "styled-jsx/css";
import MeterBar from "@/components/meter-bar/meter-bar";
import Icon from "@/components/icon/icon";
import { useLocation, useNavigate } from "react-router";
import RPGNumber from "@/utilities/rpg-number";
import { PlayerActionType } from "@/utilities/game-types";
import {RPGTag} from "@/components/tag/rpg-tag";

export default function Battle() {
    const navigate = useNavigate();
    const location = useLocation();
    const initialBattleState = useMemo(() => {
        if(location.state.battleState) {
            return location.state.battleState;
        }
        return {};
    }, [location.state.battleState]);
    const onTypeWriteEnd = useRef();
    const onEffectAnimationEnd = useRef();
    const onHealthAnimationEnd = useRef();
    const [battleState, setBattleState] = /**@type {[BattleData, (obj: BattleData) => void]}*/(useState(initialBattleState));
    const [controlMode, setControlMode] = useState('battle');
    const [optionsEnabled, setOptionsEnabled] = useState(true);
    const [typeWriterMessage, setTypeWriterMessage] = useState('');
    const [playerEffectAnim, setPlayerEffectAnim] = useState();
    const [monsterEffectAnim, setMonsterEffectAnim] = useState();
    const [results, setResults] = useState({});
    const preloadedImages = useRef({});

    if(!battleState.player || !battleState.monster) {
        return;
    }

    const updateBattleState = () => {
        setBattleState(Object.assign({}, battleState));
    };
    const exitBattle = () => {
        navigate('/panel/game', { state: { forceRefresh: true } });

    };
    const getDialog = (id) => {
        return document.querySelector(`#${id}`);
    };

    /**@type {(id: string) => BattleAgentData|undefined} */
    const getPlayerById = (id) => {
        if(battleState.player.id === id) { return battleState.player;}
        else if(battleState.monster.id === id) { return battleState.monster;}
    }

    const healthAnimationCommand = (healthChange, player, protectionChange, type) => {
        if(protectionChange && protectionChange !== 0) {
            player.protection[type] += protectionChange;
        }

        if(healthChange) {
            player.health += healthChange;
        }
        
        if (protectionChange || healthChange) {
            return new Promise((resolve, reject) => {
                updateBattleState();
                onHealthAnimationEnd.current = (id) => {
                    console.log(id);
                    if (player.id === id) {
                        resolve();
                    }
                };
            });
        }
    }

    const playerEffectAnimationCommand = (animation, playerId) => {
        return new Promise((resolve, reject) => {
            if(playerId === battleState.player.id) {
                setPlayerEffectAnim(animation);
            }
            else {
                setMonsterEffectAnim(animation);
            }
            onEffectAnimationEnd.current = () => {
                setPlayerEffectAnim();
                setMonsterEffectAnim();
                resolve();
            };
        });
    };

    const waitCommand = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    const typeWriterMessageCommand = (message) => {
        return new Promise((resolve, reject) => {
            setControlMode('typeWriter');
            setTypeWriterMessage(oldText => {
                if(oldText === message)
                {
                    return message + ' ';
                }
                return message;
            });
            onTypeWriteEnd.current = () => {
                resolve();
            };
        });
    };
    const runBattleIteration = async (battleUpdate) => {
        const steps = battleUpdate.steps;
        for(const step of steps) {
            switch(step.type) {
                case 'battleEnd': {
                    const status = battleUpdate.result.status;
                    setResults(battleUpdate.result);
                    if(status === 'victory') {
                        const dialog = getDialog('victory');
                        dialog.showModal();
                    }
                    else {
                        const dialog = getDialog(status);
                        dialog.showModal();
                    }
                    break;
                }
                case 'damage': {
                    const target = getPlayerById(step.targetId);
                    await healthAnimationCommand(-step.damage, target, -step.protectedDamage, step.protectedDamageType);
                    break;
                }
                case 'revive': {
                    const target = getPlayerById(step.targetId);
                    target.autoRevive = 0;
                    updateBattleState();
                    await healthAnimationCommand(step.healAmount, target);
                    break;
                }
                case 'heal': {
                    const target = getPlayerById(step.targetId);
                    await healthAnimationCommand(step.healAmount, target);
                    break;
                }
                case 'apGain': {
                    const target = getPlayerById(step.targetId);
                    target.ap += step.apGain;
                    updateBattleState();
                    break;
                }
                case 'protection': {
                    const protectionStep = /**@type {ProtectionStep}*/(step);
                    const target = getPlayerById(step.targetId);
                    const protectionType = protectionStep.protection.physical ? PlayerActionType.Physical : PlayerActionType.Magical;
                    const protectionValue = protectionStep.protection[protectionType];
                    await healthAnimationCommand(0, target, protectionValue, protectionType);
                    break;
                }
                case 'readyRevive': {
                    const target = getPlayerById(step.targetId);
                    target.autoRevive = step.autoRevive;
                    updateBattleState();
                    break;
                }
                case 'gainStatusEffect': {
                    const target = getPlayerById(step.targetId);
                    target.statusEffects[step.statusEffect.name] = step.statusEffect;
                    updateBattleState();
                    break;
                }
                case 'removeStatusEffect': {
                    const target = getPlayerById(step.targetId);
                    delete target.statusEffects[step.statusEffect.name];
                    updateBattleState();
                    break;
                }
                case 'apChange': {
                    const apChangeStep = /**@type {ApChangeStep}*/(step);
                    const target = getPlayerById(apChangeStep.targetId);
                    if (!target) {break;}
                    target.ap += apChangeStep.netChange;
                    updateBattleState();
                    break;
                }
                case 'maxApChange': {
                    const apMaxChangeStep = /**@type {MaxApChangeStep}*/(step);
                    const target = getPlayerById(apMaxChangeStep.targetId);
                    if (!target) {break;}
                    target.maxAp += apMaxChangeStep.netChange;
                    updateBattleState();
                }
                case 'addEffect': {
                    const addEffectStep = /**@type {AddEffectStep}*/(step);
                    if (!addEffectStep.successful) {break;}
                    const target = getPlayerById(addEffectStep.effect.targetId);
                    if (!target) {break;}
                    battleState.effects.push(addEffectStep.effect);
                    updateBattleState();
                    break;
                }
                case 'removeEffect': {
                    const removeEffectStep = /**@type {RemoveEffectStep}*/(step);
                    if (!removeEffectStep.successful) {break;}
                    const removeEffect = removeEffectStep.effect;
                    const target = getPlayerById(removeEffectStep.effect.targetId);
                    if (!target) {break;}
                    const effectIndex = battleState.effects.findIndex((effect) => {
                        return effect.className === removeEffect.className &&
                        effect.targetId === removeEffect.targetId
                    });
                    if (effectIndex != -1) {
                        battleState.effects.splice(effectIndex, 1);
                        updateBattleState();
                    }
                    break;
                }
            }
            if(step.animation && (step.targetId || step.actorId)) {
                const id = step.targetId ? step.targetId : step.actorId;
                await playerEffectAnimationCommand(step.animation, id);
            }
            if(step.description) {
                await typeWriterMessageCommand(step.description);
                await waitCommand(500);
            }
        }

        setBattleState(battleUpdate);
        return battleUpdate;
    }

    const onAbilityClicked = (ability) => {
        if(ability.apCost > battleState.player.ap) {
            setBattleUIEnabled(false);
            typeWriterMessageCommand(`${battleState.player.name} does not have enough AP to use this ability.`)
            .then(() => {
                return waitCommand(500);
            })
            .then(() => {
                setBattleUIEnabled(true);
            });
            return;
        }

        commitBattleAction({actionType: 'ability', abilityName: ability.name});

    };

    const onItemClicked = (item) => {
        commitBattleAction({actionType: 'item', itemId: item.id});
    };

    const onItemButtonClicked = () => {
        if(controlMode === 'battle') {
            setControlMode('items');
        }
        else if (controlMode === 'items') {
            setControlMode('battle');
        }
    };

    const setBattleUIEnabled = (value) => {
        if(value) {
            setControlMode('battle');
        }
        else {
            setControlMode('waiting');
        }
        setOptionsEnabled(value);  
    };

    const commitBattleAction = (actionRequest) => {
        setBattleUIEnabled(false);
        backend.battleAction(initialBattleState.id, actionRequest)
        .then(battleUpdate => {
            for(const step of battleUpdate.steps){
                if(step.animation) {
                    preloadImages([step.animation.spriteSheet], preloadedImages.current);
                }
            }
            return runBattleIteration(battleUpdate)
        })
        .then((battleUpdate) => {
            if(battleUpdate.active) {
                setBattleUIEnabled(true);
            }
            else {
                setOptionsEnabled(false);
            }
        })
        .catch(error => {
            setControlMode('error');
            waitCommand(1000)
            .then(() => {
                setBattleUIEnabled(true);
            });
        });
    };

    const battleItems = battleState.player.bag.objects.filter(object => {
        return object.type === 'item'
    });

    const itemStyle = controlMode === 'items' ? {background: 'transparent', border: `2px solid ${colors.orange}`} : {};
    const playerZ = playerEffectAnim ? 1 : 0;
    const monsterZ = monsterEffectAnim ? 1 : 0;
    return (
        <>
            <Head>
                <title>Battle</title>
                <meta name="description" content="Player fights a monster." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={battleStyle['battle']}>
                <div className={battleStyle['battle-zone']}>
                    <Image fill alt="A tropical jungle background" src="tropic-battle.webp"></Image>
                    <div className={battleStyle['header']}>
                        <BattleHeader player={battleState.player}/>
                        <BattleHeader player={battleState.monster}/>
                    </div>
                    <div className={battleStyle['avatars']}>
                        <BattleAvatar player={battleState.player} battleData={battleState} effectAnimation={playerEffectAnim} showAP showReviveActive zIndex={playerZ}
                            onHealthAnimationEnd={onHealthAnimationEnd.current} onEffectAnimationEnd={onEffectAnimationEnd.current}/>
                        <BattleAvatar player={battleState.monster} battleData={battleState} effectAnimation={monsterEffectAnim} rightSide zIndex={monsterZ}
                            onHealthAnimationEnd={onHealthAnimationEnd.current} onEffectAnimationEnd={onEffectAnimationEnd.current}/>
                    </div>
                </div>
                <div className={battleStyle['controls']}>
                    {controlMode === 'battle' && <BattleControls player={battleState.player} battleData={battleState} onAbilityClicked={onAbilityClicked} onStrikeClicked={() => {commitBattleAction({actionType: 'strike'})}}/>}
                    {controlMode === 'items' && <ItemControls items={battleItems} onItemClicked={onItemClicked}/>}
                    {controlMode === 'waiting' && <MessageControls>Waiting...</MessageControls>}
                    {controlMode === 'error' && <MessageControls>Sorry, Something went wrong</MessageControls>}
                    {controlMode === 'typeWriter' && <TypeWriter onEnd={onTypeWriteEnd.current}>{typeWriterMessage}</TypeWriter>}
                    {controlMode === 'exit' && <ExitControls onExitClicked={exitBattle}>{typeWriterMessage}</ExitControls>}
                </div>
                <div className={battleStyle['options']}>
                    {optionsEnabled &&
                        <>
                            <Button className={battleStyle['options-btn']} onClick={()=>commitBattleAction({actionType: 'escape'})}>Escape</Button>
                            <Button style={itemStyle} className={battleStyle['options-btn']} onClick={onItemButtonClicked}>Items</Button>
                        </>
                    }
                </div>
            </div>
            <EscapedDialog id='escape' onExitClicked={exitBattle}/>
            <DefeatDialog id='defeat' onExitClicked={exitBattle}/>
            <DrawDialog id='draw' onExitClicked={exitBattle}/>
            <VictoryDialog id='victory' oldExp={initialBattleState.player.exp} oldExpToNextLevel={initialBattleState.player.expToNextLevel} newExp={battleState.player.exp}
                newExpToNextLevel={battleState.player.expToNextLevel} expGain={results.expAward} oldLevel={initialBattleState.player.level} levelUps={results.levelGain} 
                drops={results.drops} onExitClicked={exitBattle}/>
        </>
    );
}

function BattleHeader({player}) {

    const levelStyle = {
        fontSize: '12px',
        textAlign: 'center'
    };
    return (
        <div className={battleStyle['battle-header']}>
            <span className={battleStyle['battle-header-name']}>{player.name}</span>
            <span style={levelStyle}>Level {player.level}</span>
        </div>
    );
}

/**
 * 
 * @param {{
 * player: BattleAgentData
 * }} attributes 
 * @returns 
 */
function BattleAvatar({player, battleData, showAP, rightSide, effectAnimation, showReviveActive, zIndex = 0, onHealthAnimationEnd, onEffectAnimationEnd}) {
    const reviveReady = findEffect(player, battleData, 'ReviveEffect') !== undefined;
    const scale = rightSide ? "-1 1" : "1 1";

    let spriteClasses = `${battleStyle['avatar-sprite']}`;
    if (rightSide) {
        spriteClasses += ` ${battleStyle['avatar-sprite-right']}`;
    }
    else {
        spriteClasses += ` ${battleStyle['avatar-sprite-left']}`;
    }
    return (
        <div className={battleStyle['battle-avatar']} style={{zIndex:zIndex}}>

            <div className={battleStyle['battle-avatar-base-layer']}>
                <HealthBar agentId={player.id} health={player.health} maxHealth={player.maxHealth} physicalProtection={player.protection.physical}
                    magicalProtection={player.protection.magical} onHealthAnimationEnd={onHealthAnimationEnd}></HealthBar>
                <div className={battleStyle['avatar-image-position']}>
                    <div className={battleStyle['avatar-image-float']}>
                        <div style={{scale: scale}} className={battleStyle['avatar-image-container']}>
                            <Image alt="avatar" fill src={player.avatar} className={battleStyle['avatar-image']}/>
                        </div>
                    </div>
                    <div className={battleStyle['sprite-container']}>
                        {(effectAnimation) && <Sprite style={{zIndex:zIndex+10}} columns={effectAnimation.columns} rows={effectAnimation.rows} spriteSheet={effectAnimation.spriteSheet}
                            frameWidth={effectAnimation.frameWidth} frameHeight={effectAnimation.frameHeight} className={spriteClasses} duration={effectAnimation.duration}
                            onAnimationEnd={onEffectAnimationEnd}/>}
                    </div>
                </div>
            </div>

            {showAP && <APTracker apNumber={player.ap} maxAp={player.maxAp}/>}
            
            <StatusEffects agent={player} battle={battleData}/>
            {(showReviveActive && reviveReady) && <Icon src='phoenix_down.webp' className={battleStyle['revive-ready']}/>}
        </div>
    );
}

/**
 * 
 * @param {{
 * agent: BattleAgent,
 * battle: BattleData
 * }} attributes 
 * @returns 
 */
function StatusEffects({agent, battle}) {
    const indicators = [];

    for(const statusEffect of [
        ['AblazedEffect', 'ablazed'],
        ['SurgedEffect', 'surged'],
        ['DrenchedEffect', 'drenched'],
        ['FrozenEffect', 'frozen']
    ]) {
        if (findEffect(agent, battle, statusEffect[0])) {
            indicators.push(<StatusEffect key={statusEffect[0]} color={colors.getElementalColor(statusEffect[1])}>{statusEffect[1]}</StatusEffect>)
        }
    }

    return (
        <div className={battleStyle['status-effects']}>
            {indicators}
        </div>
    );
}

function StatusEffect({color, children}) {
    return (
        <div style={{background: color}} className={battleStyle['status-effect']}>
            <span>{children}</span>
        </div>
    );
}

function Sprite({columns=1, rows=1, frameWidth=1, frameHeight=1, duration=1000, spriteSheet, style, className='', onAnimationEnd}) {
    const totalFrames = columns * rows;
    const frame = useIntAnimation(0, totalFrames, duration, onAnimationEnd, true);
    const spriteStyle = {
        aspectRatio: `${frameWidth} / ${frameHeight}`
    };

    const imageStyle = {
        position: 'absolute',
        objectFit: 'fill',
        width: `${100 * columns}%`,
        height: `${100 * rows}%`,
        left: `-${100 * (frame % columns)}%`,
        top: `-${100 * Math.floor(frame / columns)}%`,
    };

    return (
        <div style={{...spriteStyle, ...style}} className={`${battleStyle['sprite']} ${className}`}>
            <Image alt="animation effect" style={imageStyle} width={frameWidth} height={frameHeight} src={spriteSheet}/>
        </div>
    );
}

/**
 * 
 * @param {{
 * apNumber: number,
 * maxAp: number
 * }} attribute 
 * @returns 
 */
function APTracker({apNumber, maxAp=3}) {
    const apTextStyle = {
        textAlign: 'center',
        fontSize: '12px'
    };

    const apNodes = [];
    for(let i = 0; i < maxAp; i++) {
        let className = battleStyle['ap-node-empty'];
        if(apNumber > i) {
            className = battleStyle['ap-node'];
        }
        apNodes.push(<div className={className} key={i}/>);
    }
    return (
        <div className={battleStyle['ap-tracker']}>
            <span style={apTextStyle}>AP</span>
            <div className={battleStyle['ap-bar']}>
                {apNodes}
            </div>
        </div>
    );
}

/**
 * 
 * @param {{
 * player: BattleAgentData
 * battleData: BattleData
 * }} attributes 
 * @returns 
 */
function BattleControls({player, battleData, onStrikeClicked, onAbilityClicked}) {
    if (!player) {
        return;
    }

    const imbuedElements = [];
    for (const imbueEffect of findAllEffects(player, battleData, 'ImbueEffect')) {
        if (!imbuedElements.includes(imbueEffect.inputData.element)) {
            imbuedElements.push(imbueEffect.inputData.element);
        }
    }
    const strikeAbilityReady = player.strikeLevel >= 2;
    const strikeText = strikeAbilityReady ? player.weapon.strikeAbility.name : 'Strike';

    /**@type {(ability?: AbilityData) => string} */
    const generateGradient = (ability) => {
        let chosenElements = [];

        if (ability) {
            if (ability.style === player.weapon.style) {
                chosenElements = [...imbuedElements];
            }
    
            if (ability.elements) {
                for (const element of ability.elements) {
                    chosenElements.push(element);
                }
            }
        }
        else {
            chosenElements = [...imbuedElements];
        }

        if (chosenElements.length === 0) {
            chosenElements.push(null, null);
        }

        if (chosenElements.length === 1) {
            chosenElements.push(chosenElements[0]);
        }

        let gradient = 'linear-gradient(-45deg';
        
        for (let i = 0; i < chosenElements.length; i++) {
            gradient += ',';
            const percentage = 100 / chosenElements.length;
            gradient += `${colors.getElementalColor(chosenElements[i])} ${percentage * i}% ${percentage * (i+1)}%`;
        }

        gradient += ")"
        return gradient;
    };

    const strikeAbility = player.weapon.strikeAbility;
    const hasStrikeElements = imbuedElements.length || strikeAbilityReady && strikeAbility.elements && strikeAbility.elements.length > 0;

    const strikeButtonStyle = {
        backgroundImage: `url(${backend.getResourceURL(player.weapon.icon)}) ${hasStrikeElements ? `,${strikeAbilityReady ? generateGradient(strikeAbility) : generateGradient()}` : ''}`,
        backgroundColor: !imbuedElements.length ? 'var(--foreground-rgb)' : '',
        border: player.strikeLevel === 1 ? "4px solid var(--orange)" : ''
    };

    const abilityButtons = player.abilities.map((ability, index) => {
        const style = {
            background: generateGradient(ability)
        };
        if (index > 4) {
            style.border = "2px solid var(--foreground-rgb)";
        }
        const tagStyle = {
            background: player.ap >= ability.apCost ? colors.blue : colors.red
        };
        return (
        <Button key={index} style={style} className={battleStyle['battle-btn']} onClick={()=>{onAbilityClicked?.(ability)}}>
            {ability.apCost && <RPGTag style={tagStyle}>{ability.apCost}</RPGTag>}
            {ability.name}
        </Button>);
    });

    return (
            <div className={battleStyle['battle-controls-frame']}>
                <Button style={strikeButtonStyle} className={`${battleStyle['battle-btn']} ${battleStyle['strike-btn']}`} onClick={onStrikeClicked}>{strikeText}</Button>
                {abilityButtons}
        </div>
    )
}

function MessageControls({children}) {
    return (
        <div style={{
            padding: '5px',
            height: '100%',
            fontSize: '1.5em',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            {children}
        </div>
    );
}

function TypeWriter({onEnd, children}) {
    const text = useTypeWriterAnimation(children, 30, onEnd);
    return (
        <div className={battleStyle['type-writer']}>
            {text}
        </div>
    );
}

function ExitControls({onExitClicked}) {
    return (
        <div className={battleStyle['exit-controls']}>
            <Button onClick={onExitClicked}>exit</Button>
        </div>
    );
}

function ItemControls({items, onItemClicked}) {

    const itemButtons = items.map(item => {
        return (
                <div key={item.id} style={{position: 'relative'}}>
                    <RPGTag>{item.content.count}</RPGTag>
                    <div className={battleStyle['battle-item-content']} onClick={()=>{onItemClicked?.(item)}}>
                        <Icon style={{flexShrink: '0'}} src={item.content.icon}/>
                        <span style={{display: 'flex'}}>{item.content.name}</span>
                    </div>
                </div>
        );
    });
    return (
        <div className={battleStyle['item-controls']}>
            {itemButtons}
        </div>
    );
}

function EscapedDialog({id, onExitClicked}) {
    return (
        <BattleDialog id={id} headerColor={colors.orange} headerText='Escaped!' onExitClicked={onExitClicked}>
            <span style={{fontSize: '1.25em'}}>You have made it to safety!</span>
            <span>{getGameTip()}</span>
        </BattleDialog>
    );
}

function VictoryDialog({id, oldExp, oldExpToNextLevel, newExp, newExpToNextLevel, expGain, oldLevel, levelUps=0, drops=[], onExitClicked}) {
    const [startExp, setStartExp] = useState(oldExp);
    const [expToNextLevel, setExpToNextLevel] = useState(oldExpToNextLevel);
    const [finalExp, setFinalExp] = useState(levelUps > 0 ? oldExpToNextLevel : newExp);
    const [level, setLevel] = useState(oldLevel);
    const levelUp = useRef(0);

    useEffect(()=>{
        setStartExp(oldExp);
        setExpToNextLevel(oldExpToNextLevel);
        setFinalExp(levelUps > 0 ? oldExpToNextLevel : newExp);
        setLevel(oldLevel);
        levelUp.current = 0;
    }, [oldExp, oldExpToNextLevel, levelUps, newExp, oldLevel]);

    const animCallback = useCallback(()=>{
        if(finalExp === expToNextLevel) {
            levelUp.current += 1;
            setLevel(_level => ++_level);
            if(levelUp.current < levelUps) {
                setStartExp(0);
                setFinalExp(1);
                setExpToNextLevel(1);
            }
            else if(levelUp.current === levelUps) {
                setStartExp(0);
                setFinalExp(newExp);
                setExpToNextLevel(newExpToNextLevel);
            }
        }
    }, [finalExp, expToNextLevel, levelUps, newExp, newExpToNextLevel]);
    const exp = useNumberAnimation(startExp, finalExp, 500, animCallback);

    const dropsList = drops.map((drop, index) => {
        const weaponStyle = {
            rotate: '-45deg'
        };
        const style = drop.type === 'weapon' ? weaponStyle : {};
        return (
            <div key={index} className={battleStyle['drop']}>
                {drop.content.icon &&
                <div className={battleStyle['drop-icon']}>
                    <Image style={style} fill alt="Icon of a gold coin." src={drop.content.icon}/>
                </div>}
                <span>{drop.content.name}</span>
            </div>
        );
    });
    return (
        <BattleDialog id={id} headerColor={colors.green} headerText='Victory!' onExitClicked={onExitClicked}>
            <span style={{fontSize: '1.25em'}}>Level {level}</span>
            <span>+{expGain} exp</span>
            <MeterBar style={{width: '100%', maxWidth: '205px'}} progress={exp/expToNextLevel} barColor={colors.blue}/>
            {dropsList.length > 0 && <span style={{fontSize: '1.25em'}}>Monster Drops</span>}
            {dropsList}
        </BattleDialog>
    );
}

function DefeatDialog({id, onExitClicked}) {
    return (
        <BattleDialog id={id} headerColor={colors.red} headerText='Defeat!' onExitClicked={onExitClicked}>
            <NoHPHelp/>
        </BattleDialog>
    );
}

function DrawDialog({id, onExitClicked}) {
    return (
        <BattleDialog id={id} headerColor={colors.grey} headerText='Draw!' onExitClicked={onExitClicked}>
            <NoHPHelp/>
        </BattleDialog>
    );
}

function BattleDialog({id, open, headerColor, headerText, children, onExitClicked}) {
    return (
        <Dialog open={open} id={id} onClose={onExitClicked}>
            <div style={{background: headerColor}} className={battleStyle['dialog-header']}>{headerText}</div>
            <div className={battleStyle['dialog-content']}>
                {children}
                <Button className={battleStyle['dialog-content-exit-btn']} onClick={onExitClicked}>exit</Button>
            </div>
        </Dialog>
    );
}

function NoHPHelp() {
    return (
        <>
            <span style={{fontSize: '1.25em'}}>Your HP will be restored</span>
            <span>{getGameTip()}</span>
        </>
    );
}

/**
 * 
 * @param {{
 * health: number,
 * maxHealth: number,
 * physicalProtection?: number,
 * magicalProtection?: number,
 * onHealthAnimationEnd?: () => void
 * }} param0 
 * @returns 
 */
function HealthBar({agentId, health, maxHealth, physicalProtection=0, magicalProtection=0, onHealthAnimationEnd}) {
    const [targetMagicalProtection, setTargetMagicalProtection] = useState(magicalProtection);
    const [targetPhysicalProtection, setTargetPhysicalProtection] = useState(physicalProtection);
    const [targetHealth, setTargetHealth] = useState(health);

    const oldMagicalProtection = useRef(magicalProtection);
    const oldPhysicalProtection = useRef(physicalProtection);
    const oldHealth = useRef(health);
    const animSequence = useRef([]);

    const onHealthAnimEnd = useCallback(() => {
        oldMagicalProtection.current = magicalProtection;
        oldPhysicalProtection.current = physicalProtection;
        oldHealth.current = health;
        onHealthAnimationEnd?.(agentId);
    }, [health, magicalProtection, physicalProtection, onHealthAnimationEnd]);

    useEffect(() => {
        if (health !== oldHealth.current) {
            animSequence.current.push(() => setTargetHealth(health));
        }
    }, [health]);

    useEffect(() => {
        if (physicalProtection !== oldPhysicalProtection.current) {
            animSequence.current.push(() => setTargetPhysicalProtection(physicalProtection));
        }
    }, [physicalProtection]);

    useEffect(() => {
        if (magicalProtection !== oldMagicalProtection.current) {
            animSequence.current.push(() => setTargetMagicalProtection(magicalProtection));
        }
    }, [magicalProtection]);

    const triggerNextAnim = useCallback(() => {
        if (animSequence.current.length > 0) {
            animSequence.current.pop()();
        }
        else {
            onHealthAnimEnd();
        }
    }, [animSequence, onHealthAnimEnd]);

    useEffect(() => {
        triggerNextAnim();
    }, [triggerNextAnim]);

    const currentMagicalProtection = useNumberAnimation(oldMagicalProtection.current, targetMagicalProtection, 500, triggerNextAnim);
    const currentPhysicalProtection = useNumberAnimation(oldPhysicalProtection.current, targetPhysicalProtection, 500, triggerNextAnim);
    const currentHealth = useNumberAnimation(oldHealth.current, targetHealth, 500, triggerNextAnim);

    const protectionText = [];
    if(currentMagicalProtection > 0) {
        protectionText.push(<span style={{color: colors.teal}} key='mProtec'>{RPGNumber(currentMagicalProtection/maxHealth * 100)}%</span>);
    }

    if(currentPhysicalProtection > 0) {
        protectionText.push(<span style={{color: colors.orange}} key='pProtec'>{RPGNumber(currentPhysicalProtection/maxHealth * 100)}%</span>);
    }
    const healthBottom = <div style={{display: 'flex', gap: '10px'}}>{protectionText}</div>

    return (
        <LabeledMeterBar progress={currentHealth/maxHealth} bottomLabel={healthBottom} className={battleStyle['avatar-health-bar']}>{RPGNumber(currentHealth)}</LabeledMeterBar>
    );
}

function preloadImages(array, preloadImages) {
    if (!preloadImages.list) {
        preloadImages.list = [];
    }
    var list = preloadImages.list;
    for (var i = 0; i < array.length; i++) {
        var img = document.createElement('img');
        img.onload = function() {
            var index = list.indexOf(this);
            if (index !== -1) {
                // remove image from the array once it's loaded
                // for memory consumption reasons
                list.splice(index, 1);
            }
        }
        list.push(img);
        img.src = backend.getResourceURL(array[i]);
    }
}

/**
 * @param {BattleAgent} agent 
 * @param {BattleData} battle 
 * @param {string} name
 * @returns {EffectData|undefined} 
 */
function findEffect(agent, battle, name) {
    return battle.effects.find((effect) => {
        return effect.className === name && agent.id === effect.targetId;
    });
}

/**
 * @param {BattleAgent} agent 
 * @param {BattleData} battle 
 * @param {string} name
 * @returns {EffectData[]} 
 */
function findAllEffects(agent, battle, name) {
    const effects = [];
    for (const effect of battle.effects) {
        if (effect.className === name && agent.id === effect.targetId) {
            effects.push(effect);
        }
    }
    return effects;
}
