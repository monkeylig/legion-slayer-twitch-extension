/**
 * @import {BattleStep, HealStep, AgentData, ItemData, AbilityData, CollectionContainer} from "@/utilities/backend-calls"
 * @import {GrowthObject} from '@/utilities/game-stats'
 */

import HeaderBarBack from '@/components/header-bar/header-bar-back';
import Head from 'next/head'
import Image from 'next/image';
import objectViewStyle from '@/styles/object-view.module.css'
import Button from '@/components/button/button';
import TextBox from '@/components/text-box/text-box';
import { useEffect, useMemo, useState } from 'react';
import StatSheet from '@/components/stat-sheet/stat-sheet';
import colors from '@/utilities/colors';
import backend from '@/utilities/backend-calls';
import frontendContext from '@/utilities/frontend-context';
import AsyncButton from '@/components/button/async-button';
import AbilityView from '@/components/stat-sheet/ability-view';
import Dialog from '@/components/dialog/dialog';
import Currency from '@/components/currency/currency';
import { useLocation, useNavigate } from 'react-router-dom';
import LabeledMeterBar from '../meter-bar/labeled-meter-bar';
import RPGNumber from '@/utilities/rpg-number';
import { calcWeaponGrowthStats } from '@/utilities/game-stats';

const MAX_ABILITIES = 5;

export default function ObjectView() {
    const navigate = useNavigate();
    const location = useLocation();
    const [player, setPlayer] = useState(frontendContext.get().player);
    const controlMode = location.state.mode;
    const [object, setObject] = useState(location.state.object ? location.state.object : {
        content: {
            name: ''
        },
        product: {
            name: ''
        },
    });
    let container = 'content';

    if(controlMode === 'shop') {
        container = 'product';
    }

    const inBag = player.bag.objects.find(bagObject => {
        return bagObject.id === object.id;
    }) !== undefined;

    let numInBag = 0;
    if(object.type === 'item') {
        const item = player.bag.objects.find((bagItem) => bagItem.content.name === object[container].name);
        if(item) {
            numInBag = item.content.count;
        }
    }

    const updatePlayer = (player) => {
        setPlayer(player);
    };
    const onMoveToBag = (player) => {
        setPlayer(player);
    };
    const tiltStyle = object.type === 'weapon' ? {rotate: '-45deg'} : {}
    return (
        <>
            <Head>
                <title>{object[container].name}</title>
                <meta name="description" content="View details of game objects." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <HeaderBarBack title={object[container].name} onBackClicked={()=>{navigate(-1)}}/>
            <div className={objectViewStyle['icon-display']}>
                <Image sizes='318px' alt='object icon' style={{objectFit: 'contain', ...tiltStyle}} fill src={object[container].icon}/>
                <div className={objectViewStyle['live-stats']}>
                    {controlMode === 'shop' && <Currency>{player.coins}</Currency>}
                    {(numInBag != 0 && object.type === 'item') && <span>x{numInBag} in Bag</span>}
                    {(object[container].count && controlMode === 'inventory') && <span>x{object[container].count}</span>}
                </div>
            </div>
            <div className={objectViewStyle['page-controls']}>
                {controlMode === 'shop' && <ShopControls object={object} onBuy={(player) => setPlayer(player)}/>}
                {controlMode === 'bag' && <BagControls inBag={inBag} object={object} onPlayerUpdate={updatePlayer}/>}
                {controlMode === 'claim' && <ClaimControls object={object} onPlayerUpdate={updatePlayer}/>}
                {controlMode === 'inventory' && <InventoryControls object={object} pageId={location.state.pageId} onMove={onMoveToBag}
                    onObjectUpdate={(newObject) => {setObject(newObject)}}/>}
            </div>
            <div className={objectViewStyle['item-data']}>
                <span className={objectViewStyle['object-description']}>{object[container].description}</span>
                {object.type === 'weapon' && <WeaponData weapon={object[container]} />}
                {object.type === 'book' && <BookData book={object[container]} bookId={object.id} inBag={inBag} onPlayerUpdate={updatePlayer}/>}
            </div>
        </>
    );
}

function ShopControls({object, onBuy}) {
    const [amount, setAmount] = useState(1);

    const onChange = (e) => {
        let input = e.target.value;
        if(input > 100) {
            input = 100;
        }
        else if(input < 1) {
            input = 1;
        }
        setAmount(input);
    };
    return (
        <>
            <Currency size={24}>{object.price * amount}</Currency>
            <ShopBuyButton productId={object.id} amount={amount} onBuy={onBuy}>Buy</ShopBuyButton>
            {object.type === 'item' && <TextBox type='number' value={amount} min="1" max="100" label='amount' className={objectViewStyle['amount-input']} onInput={onChange}></TextBox>}
        </>
    );
}

/**
 * 
 * @param {{
 * object: CollectionContainer,
 * inBag: boolean,
 * onPlayerUpdate?: (player: *)=> void
 * }} param0 
 * @returns 
 */
function BagControls({object, inBag, onPlayerUpdate}) {
    const [battleSteps, setBattleSteps] = useState([]);
    const player = frontendContext.get().player;
    const onClick = async () => {
        const newPlayer = await backend.moveObjectFromBagToInventory(player.id, object.id);
        onPlayerUpdate?.(newPlayer);
    };
    const equipWeapon = async () => {
        const playerData = await backend.equipWeapon(player.id, object.id);
        if(onPlayerUpdate) {
            onPlayerUpdate(playerData);
        }
    };

    const useItem = async () => {
        const result = await backend.useItem(player.id, object.id);
        onPlayerUpdate?.(result.player);
        setBattleSteps(result.steps);

        const dialog = document.getElementById(`itemUsedDialog`);
        dialog.showModal();
    };

    let moveText;
    if(inBag) {
        moveText = 'move';
    }
    else if(!inBag) {
        moveText = 'not in bag';
    }
    return (
        <>
            {object.type === 'weapon' &&
                <AsyncButton disabled={!inBag} className={objectViewStyle['action-btn']} onClick={equipWeapon}>
                    {object.content.name === player.weapon.name ? 'equipped' : 'equip'}
                </AsyncButton>}

            <AsyncButton disabled={!inBag} style={{background: colors.red}} className={objectViewStyle['action-btn']} onClick={onClick}>
                {moveText}
            </AsyncButton>
            {(object.type && object.type === 'item' && /**@type {ItemData}*/(object.content).outOfBattle) &&
            <AsyncButton style={{background: colors.blue}} className={objectViewStyle['action-btn']} onClick={useItem}>
                Use
            </AsyncButton>}

            <ItemUsedDialog battleSteps={battleSteps} id='itemUsedDialog'></ItemUsedDialog>
        </>
    );
}

function ClaimControls({object, onPlayerUpdate}) {
    const player = frontendContext.get().player;
    let buttonEnabled = true;
    if (!player.lastDrops.objects.find(claimObject => claimObject.id === claimObject.id)) {
        buttonEnabled = false;
    }
    const onClick = () => {
        backend.claimObject(player.id, object.id)
        .then(player => {
            if(onPlayerUpdate) {
                onPlayerUpdate(player);
            }
        });
    };
    return (
        <>
            { buttonEnabled && <Button style={{background: colors.blue}} className={objectViewStyle['action-btn']} onClick={onClick}>claim</Button> }
            { !buttonEnabled && <Button disabled style={{background: colors.blue}} className={objectViewStyle['action-btn']} onClick={onClick}>claimed!</Button> }
        </>
    );
}

/**
 * 
 * @param {{
 * object: CollectionContainer,
 * pageId: string,
 * onMove?: (AgentData) => void,
 * onObjectUpdate?: (CollectionContainer) => void
 * }} param0 
 * @returns 
 */
function InventoryControls({object, pageId, onMove, onObjectUpdate}) {
    let [buttonEnabled, setButtonEnabled] = useState(true);
    const [battleSteps, setBattleSteps] = useState([]);
    const player = frontendContext.get().player;

    const bagFull = frontendContext.get().player.bag.objects.length >= frontendContext.get().player.bag.capacity;
    let buttonText = bagFull ? 'bag full' : 'add to bag';
    if(!buttonEnabled) {
        buttonText = 'not in inventory';
    }

    const onClick = async () => {
        const update = await backend.moveObjectFromInventoryToBag(frontendContext.get().player.id, pageId, object.id);
        setButtonEnabled(false);
        onMove?.(update.player);
    };
    const useItem = async () => {
        const options = {
            itemLocation: {
                type: 'inventory',
                source: {pageId}
            }
        };
        const result = (await backend.useItem(player.id, object.id, options));
        if (result.inventoryPage) {
            const newObject = result.inventoryPage.objects.find((value, index) => value.id === object.id);
            if (newObject) {
                onObjectUpdate?.(newObject);
            }
        }
        setBattleSteps(result.steps);

        const dialog = document.getElementById(`itemUsedFromInventoryDialog`);
        dialog.showModal();
    };
    return (
        <>
            <AsyncButton disabled={bagFull} className={objectViewStyle['action-btn']} onClick={onClick}>{buttonText}</AsyncButton>
            {(object.type && object.type === 'item') && <AsyncButton style={{background: colors.blue}} className={objectViewStyle['action-btn']} onClick={useItem}>
                Use
            </AsyncButton>}
            <ItemUsedDialog battleSteps={battleSteps} id='itemUsedFromInventoryDialog'></ItemUsedDialog>
        </>
    );
}

function WeaponData({weapon}) {
    if (!weapon) {
        return;
    }

    return (
    <>
        <StatSheet.StatSheet>
            <StatSheet.Row>Type - {weapon.type}</StatSheet.Row>
            <StatSheet.Row>Style - {weapon.style}</StatSheet.Row>
            <StatSheet.Row>Base Damage - {weapon.baseDamage}</StatSheet.Row>
            <StatSheet.Row lastRow>Speed - {weapon.speed}</StatSheet.Row>
        </StatSheet.StatSheet>
        <AbilityData ability={{...weapon.strikeAbility, speed: weapon.speed}} showStatGrowth={false}/>
        <StatSheet.StatGrowthTable growthObject={calcWeaponGrowthStats(weapon)}/>
    </>
    );
}

function BookData({book, inBag, bookId, onPlayerUpdate}) {
    const abilityViews = book.abilities.map((abilityEntry, index) => {
        return <AbilityData ability={abilityEntry.ability} requirement={abilityEntry.requirements[0]} inBag={inBag} abilityBookId={bookId} abilityIndex={index} onPlayerUpdate={onPlayerUpdate} key={index}/>
    });
    return (
        <>
            {abilityViews}
        </>
    );
}

/**
 * 
 * @param {{
 * ability: AbilityData
 * }} attributes 
 * @returns 
 */
function AbilityData({ability, requirement, inBag, abilityBookId, abilityIndex, showStatGrowth=true, onPlayerUpdate = ()=>{}}) {
    const player = frontendContext.get().player;
    const unlocked = requirement && requirement.count >= requirement.requiredCount;
    const equipped = player.abilities.find(equippedAbility => equippedAbility.name === ability.name) != undefined;

    const getDialog = () => document.querySelector(`#ability-replace-dialog-${abilityIndex}`); 
    const equipAbility = async () => {
        if(player.abilities.length >= MAX_ABILITIES) {
            const dialog = getDialog();
            dialog.showModal();
            return;
        }
        const playerData = await backend.equipAbility(player.id, abilityBookId, abilityIndex);
        onPlayerUpdate(playerData);
    };

    const replaceAbility = async (abilityName) => {
        const playerData = await backend.equipAbility(player.id, abilityBookId, abilityIndex, abilityName);
        onPlayerUpdate(playerData);
        const dialog = getDialog();
        dialog.close();
    }

    const referencedAbilities = [];
    if (ability.addAbility) {
        referencedAbilities.push(<AbilityView key={ability.addAbility.name} ability={ability.addAbility}/>);
    }

    if (ability.postActions) {
        for (const action of ability.postActions) {
            if (action.addAbility) {
                referencedAbilities.push(<AbilityView key={action.addAbility.name} ability={action.addAbility}/>);
            }
        }
    }

    const replacedAbilities = player.abilities.map((replacedAbility, index) => {
        return (
            <div key={index} className={objectViewStyle['replaced-ability']}>
                <span>{replacedAbility.name}</span>
                <AsyncButton onClick={() => {replaceAbility(replacedAbility.name)}} className={objectViewStyle['replace-btn']}>replace</AsyncButton>
            </div>);
    });
    return (
        <>
            <AbilityView ability={ability} showStatGrowth={showStatGrowth}>
                {(!unlocked && requirement) && <span style={{textAlign: 'center'}}>{requirement.description}</span>}
                {(!unlocked && requirement) && <span style={{textAlign: 'center', color: colors.red}}>{requirement.count}/{requirement.requiredCount}</span>}
                {(unlocked && !equipped && inBag) && <AsyncButton className={objectViewStyle['action-btn']} onClick={equipAbility}>equip</AsyncButton>}
                {equipped && <Button disabled className={`${objectViewStyle['action-btn']}`}>equipped</Button>}
            </AbilityView>
            {referencedAbilities}
            <Dialog id={`ability-replace-dialog-${abilityIndex}`}>
                <div className={objectViewStyle['dialog-header']}>Replace Ability</div>
                {replacedAbilities}
            </Dialog>
        </>
    );
}

function ShopBuyButton({productId, amount, children, onBuy}) {
    const [timedOut, setTimedOut] = useState(false);
    const [content, setContent] = useState(children);

    let style;
    let onClick;
    if(!timedOut) {
        onClick = () => {
            setTimedOut(true);
            setContent('pending');
            backend.buy(frontendContext.get().player.id, 'daily', productId, amount)
            .then(player => {
                if(onBuy) {
                    onBuy(player);
                }
                setContent('done');
                setTimeout(() => {
                    setTimedOut(false);
                    setContent(children);
                }, 1000);
            })
            .catch(error => {
                setContent('error');
                setTimeout(() => {
                    setTimedOut(false);
                    setContent(children);
                }, 1000);
            });
        }
    }
    else {
        switch(content) {
            case 'pending':
                style = `${objectViewStyle['shop-buy-pending-button']} material-symbols-outlined`;
                break;
            case 'done':
                style = `${objectViewStyle['shop-buy-done-button']} material-symbols-outlined`;
                break;
            case 'error':
                style = `${objectViewStyle['shop-buy-error-button']} material-symbols-outlined`;
                break;
        }
    }
    return <Button className={`${objectViewStyle['action-btn']} ${style}`} onClick={onClick}>{content}</Button>
}

/**
 * 
 * @param {{
 * open: boolean,
 * battleSteps: BattleStep[],
 * id: string
 * }} param0 
 * @returns 
 */
function ItemUsedDialog({id, battleSteps, open=false}) {
    const player = /**@type {AgentData}*/(frontendContext.get().player);
    
    const stepElements = battleSteps.map((battleStep, index) => {
        if (battleStep.type === 'info') {
            return (
                <div key={index} className={`${objectViewStyle['item-used-dialog-step']} checkered-list`}>
                    <p>{battleStep.description}</p>
                </div>
            );
        }
        else if (battleStep.type === 'heal') {
            const healStep = /**@type {HealStep}*/(battleStep);
            return (
                <div key={index} className={`${objectViewStyle['item-used-dialog-step']} checkered-list`}>
                    <p>+{RPGNumber(healStep.healAmount)} HP</p>
                    <LabeledMeterBar progress={player.health/player.maxHealth}>{`${RPGNumber(player.health)}/${RPGNumber(player.maxHealth)}`}</LabeledMeterBar>
                </div>
            );
        }
    });

    return (
        <Dialog id={id} open={open}>
            <div className={objectViewStyle['item-used-dialog']}>
                {stepElements}
            </div>
        </Dialog>
    );
}