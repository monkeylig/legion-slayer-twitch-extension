/**
 * @import {BattleStep, HealStep, AgentData, ItemData, AbilityData, CollectionContainer, PlayerData, InventoryPageData, SellOptions} from "@/utilities/backend-calls"
 * @import {GrowthObject} from '@/utilities/game-stats'
 * @import {NavAction, SellNavAction} from './shop'
 * @import {ObjectMapper} from '@/utilities/object-mapping'
 */

import HeaderBarBack from '@/components/header-bar/header-bar-back';
import Head from 'next/head'
import Image from 'next/image';
import objectViewStyle from '@/styles/object-view.module.css'
import pageStyles from '@/styles/pages.module.css'
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
import { useLocation, useNavigate } from "react-router";
import LabeledMeterBar from '../meter-bar/labeled-meter-bar';
import RPGNumber from '@/utilities/rpg-number';
import { calcWeaponGrowthStats } from '@/utilities/game-stats';
import { getObjectMapValue } from '@/utilities/object-mapping';
import KeywordText from '../text/keyword-text';

/**
 * @typedef {Object} ObjectViewControls
 * @property {(objectId: string) => Promise<{
 *     player: PlayerData,
 *     page: InventoryPageData
 * }>} moveToInventory
 * 
 * @property {(pageId, objectId) => Promise<{
 *     player: PlayerData,
 *     page: InventoryPageData,
 *     objectInBag: CollectionContainer
 * }>} moveToBag
 * 
 * @property {(weaponId: string) => Promise<PlayerData>} equipWeapon
 * 
 * @property {(objectId: string, options: {itemLocation?: {type: string, source: {pageId?: string}}}) => Promise<{
 *     player: AgentData,
 *     steps: BattleStep,
 *     inventoryPage?: InventoryPageData
 * }>} useItem
 * 
 * @property {(options: SellOptions) => Promise<{
 *     player: PlayerData,
 *     inventoryPage: InventoryPageData,
 *     soldObject: Object
 * }>} sell
 * 
 */

export default function ObjectView() {
    const navigate = useNavigate();
    const location = useLocation();
    const [player, setPlayer] = useState(/**@type {PlayerData}*/(frontendContext.get().player));
    const [storageLocation, setStorageLocation] = useState(location.state.mode);

    const controlMode = location.state.mode;
    let controlAction = /**@type {NavAction}*/(location.state.action);
    const object = location.state.object;
    let container = 'content';

    if(object.product) {
        container = 'product';
    }

    if (!controlAction) {
        controlAction = {};
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

    /**
     * 
     * @param {string} objectId
     * @returns {Promise<{
     *     player: PlayerData,
     *     page: InventoryPageData
     * }>} 
     */
    const moveToInventory = async (objectId) => {
        const result = await backend.moveObjectFromBagToInventory(player.id, objectId);
        setPlayer(result.player);
        setStorageLocation('inventory');

        return result;
    } 

    /**
     * 
     * @param {string} pageId 
     * @param {string} objectId 
     * @returns {Promise<
     *     player: PlayerData,
     *     page: InventoryPageData,
     *     objectInBag: CollectionContainer
     * >}
     */
    const moveToBag = async (pageId, objectId) => {
        const result = await backend.moveObjectFromInventoryToBag(player.id, pageId, objectId);
        setPlayer(result.player);
        setStorageLocation('bag');

        return result;
    }

    /**
     * 
     * @param {string} weaponId
     * @returns {Promise<PlayerData>} 
     */
    const equipWeapon = async (weaponId) => {
        const _player = await backend.equipWeapon(player.id, weaponId);        
        setPlayer(_player);
        setStorageLocation('equipped');

        return _player;
    }
    /**
     * 
     * @param {string} objectId 
     * @param {{itemLocation?: {type: string, source: {pageId?: string}}}} options
     * @return {Promise<{
     *     player: AgentData,
     *     steps: BattleStep,
     *     inventoryPage?: InventoryPageData
     * }>} 
     */
    const useItem = async (objectId, options) => {
        const result = await backend.useItem(player.id, objectId, options);        
        setPlayer(result.player);
        object.content = result.usedItem;
        
        return result;
    }

    /**
     * 
     * @param {SellOptions} [options] 
     * @returns {Promise<{
     * player: PlayerData,
     * inventoryPage: InventoryPageData,
     * soldObject: Object
     * }>}
     */
    const sell = async (options) => {
        if (!controlAction.sell) {
            return;
        }

        if (controlMode === 'inventory' && location.state.pageId) {
            options.itemLocation = {
                inventory: {
                    pageId: location.state.pageId
                }
            };
        }
        const sellAction = /**@type {SellNavAction}*/(controlAction.sell);
        const result = await backend.sell(player.id, object.id, sellAction.shopId, options);
        setPlayer(result.player);
        object.content = result.soldObject;

        if (!result.soldObject.count || result.soldObject.count == 0) {
            setStorageLocation('sold');
        }
        
        return result;
    }

    const controls = {
        moveToInventory,
        moveToBag,
        equipWeapon,
        useItem,
        sell
    }

    const tiltStyle = object.type === 'weapon' ? {rotate: '-45deg'} : {}
    const showCoins = controlMode === 'shop' || controlAction.sell !== undefined;
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
                    {showCoins && <Currency className={pageStyles['round-background']}>{player.coins}</Currency>}
                    {(object[container].count !== undefined) && <span>x{object[container].count}</span>}
                </div>
            </div>
            <div className={objectViewStyle['page-controls']}>
                {controlMode === 'shop' && <ShopControls object={object} onBuy={(player) => setPlayer(player)}/>}
                {controlMode === 'bag' && <BagControls  object={object} storageLocation={storageLocation} action={controlAction} controls={controls}/>}
                {controlMode === 'claim' && <ClaimControls object={object} onPlayerUpdate={updatePlayer}/>}
                {controlMode === 'inventory' && <InventoryControls storageLocation={storageLocation} object={object} pageId={location.state.pageId} action={controlAction} controls={controls}/>}
                {controlMode === 'equipped' && <Button disabled className={objectViewStyle['action-btn']}>Equipped</Button>}
            </div>
            <div className={objectViewStyle['item-data']}>
                <KeywordText className={objectViewStyle['object-description']}>{object[container].description}</KeywordText>
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
        
        input = Math.floor(input);
        setAmount(input);
    };
    return (
        <>
            <Currency size={24}>{object.price * amount}</Currency>
            <ShopBuyButton productId={object.id} amount={amount} onBuy={onBuy}>Buy</ShopBuyButton>
            {object.type === 'item' && <TextBox type='number' value={amount} step="1" min="1" max="100" label='amount' className={objectViewStyle['amount-input']} onInput={onChange}></TextBox>}
        </>
    );
}

/**
 * 
 * @param {{
 * object: CollectionContainer,
 * storageLocation: string,
 * action?: NavAction,
 * controls?: ObjectViewControls
 * }} param0 
 * @returns 
 */
function BagControls({object, storageLocation, action, controls={}}) {
    const [battleSteps, setBattleSteps] = useState([]);
    const onMove = async () => {
        await controls?.moveToInventory(object.id);
    };
    const onEquipWeapon = async () => {
        await controls?.equipWeapon(object.id);
    };

    const useItem = async () => {
        const result = await controls?.useItem(object.id);
        setBattleSteps(result.steps);

        const dialog = document.getElementById(`itemUsedDialog`);
        dialog.showModal();
    };

    if (!action) {
        action = {};
    }

    const controlButtons = [];

    if (action.sell) {
        return <SellControls object={object} storageLocation={storageLocation} resellListing={action.sell.resellListing} controls={controls}/>;
    }
    else {
        if (object.type === 'weapon') {
            if (storageLocation === 'bag' ||     storageLocation === 'equipped') {
                let text = storageLocation === 'equipped' ? 'equipped' : 'equip';
                let disabled = storageLocation === 'equipped';
                controlButtons.push(
                    <AsyncButton key='equipBtn' disabled={disabled} className={objectViewStyle['action-btn']} onClick={onEquipWeapon}>
                        {text}
                    </AsyncButton>);
            }

        }
        
        if (object.type === 'item' && storageLocation === 'bag') {
            if (/**@type {ItemData}*/(object.content).outOfBattle) {
                controlButtons.push(
                    <AsyncButton key='useBtn' style={{background: colors.blue}} className={objectViewStyle['action-btn']} onClick={useItem}>
                        Use
                    </AsyncButton>
                );
            }
        }

        if (storageLocation === 'bag' || storageLocation === 'inventory') {
            let text = storageLocation === 'bag' ? 'Move' : 'In inventory';
            let disabled = storageLocation === 'inventory';
            controlButtons.push(
                <AsyncButton disabled={disabled} key='moveBtn' style={{background: colors.orange}} className={objectViewStyle['action-btn']} onClick={onMove}>
                    {text}
                </AsyncButton>);
        }
    }


    return (
        <>
            {controlButtons}
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
 * storageLocation: string,
 * action: NavAction,
 * controls: ObjectViewControls
 * }} param0 
 * @returns 
 */
function InventoryControls({object, pageId, storageLocation, action={}, controls}) {
    const [battleSteps, setBattleSteps] = useState([]);

    const bagFull = frontendContext.get().player.bag.objects.length >= frontendContext.get().player.bag.capacity;

    const onAddToBag = async () => {
        await controls?.moveToBag(pageId, object.id);
    };
    const useItem = async () => {
        const options = {
            itemLocation: {
                type: 'inventory',
                source: {pageId}
            }
        };
        const result = (await controls.useItem(object.id, options));
        setBattleSteps(result.steps);

        const dialog = document.getElementById(`itemUsedFromInventoryDialog`);
        dialog.showModal();
    };

    if (action.sell) {
        return <SellControls object={object} storageLocation={storageLocation} resellListing={action.sell.resellListing} controls={controls}/>;
    }

    const controlButtons = [];

    let addText = 'Not in inventory';
    let addButtonDisabled = false;

    if (storageLocation === 'bag') {
        addText = "In bag";
        addButtonDisabled = true;
    }

    if (storageLocation === 'inventory') {
        addText = bagFull ? 'Bag full' : 'Add to bag'
        addButtonDisabled = bagFull;

        if (object.type === 'item') {
            controlButtons.push(
                <AsyncButton key="useBtn" style={{background: colors.blue}} className={objectViewStyle['action-btn']} onClick={useItem}>
                    Use
                </AsyncButton>);
        }
    }

    controlButtons.push(
            <AsyncButton key="addBtn" disabled={addButtonDisabled} className={objectViewStyle['action-btn']} onClick={onAddToBag}>{addText}</AsyncButton>
        );

    return (
        <>
            {controlButtons}
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
        Equipping this weapon will affect how your stats change when you level up.
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
 * TODO: Make a comm version of this that will show referenced abilities
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
        if(player.abilities.length >= player.maxAbilities) {
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

    //TODO: refactor, use getReferencedAbilities() util function
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

/**
 * 
 * @param {{
 * object?: Object,
 * storageLocation?: string,
 * resellListing?: ObjectMapper,
 * controls?: ObjectViewControls
 * }} attributes 
 */
function SellControls({object, storageLocation='bag', resellListing, controls}) {
    const [amount, setAmount] = useState(1);

    if (!object) {return;}
    if (!resellListing) {return;}
    
    const onSell = async () => {
        await controls?.sell({count: amount});
        setAmount(1);
    }

    const onAmountChange = (e) => {
        let input = e.target.value;
        if(input > 100) {
            input = 100;
        }
        else if(input < 1) {
            input = 1;
        }

        input = Math.floor(input);
        setAmount(input);
    };

    const controlButtons = [];
    let text = storageLocation === 'sold' ? 'Sold' : 'Sell';
    let disabled = storageLocation === 'sold';
    const count = object.content.count;


    controlButtons.push(
        <Currency size={24}>{getObjectMapValue(object.content, resellListing) * amount}</Currency>);

    controlButtons.push(
        <AsyncButton key='sellBtn' style={{background: colors.gold}} className={objectViewStyle['action-btn']} disabled={disabled} onClick={onSell}>
            {text}
        </AsyncButton>
    );

    if (count !== undefined && count > 0) {
        controlButtons.push(
            <TextBox type='number' step="1" value={amount} min="1" max={count} label='amount' className={objectViewStyle['amount-input']} onInput={onAmountChange}></TextBox>
        );
    }

    return <>{controlButtons}</>
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
    
    if (!battleSteps) {
        return;
    }

    const stepElements = battleSteps.filter((step) => {
        if (step.action === 'item') {
            return false;
        }
        return true;
    }).map((battleStep, index) => {
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