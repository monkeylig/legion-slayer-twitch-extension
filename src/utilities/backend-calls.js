import frontendContext from "./frontend-context";

const backendURL = process.env.NODE_ENV === 'development' ? "http://localhost:4000" : 'https://web-rpg-9000.uw.r.appspot.com/';
const resourceBackendURL = 'https://storage.googleapis.com/web_rpg_resources/';

const cache = {
    game: null,
    shop: null
};

/**
 * 
 * @param {string} name 
 * @param  {...string} queryStrings 
 * @returns 
 */
function endpoint_url(name, ...queryStrings) {
    let queryString = queryStrings.length ? "?" : '';

    for(const query of queryStrings) {
        queryString += '&' + query;
    }

    return '/' + name + queryString;
}

/**
 * 
 * @param {string} endpoint 
 * @param {string} method 
 * @param {object} payload 
 * @returns 
 */
async function backendCall(endpoint, method='GET', payload) {
    const headers = {
        Authorization: `bearer ${frontendContext.get().token}`
    };

    let body = '';

    const fetchOptions = {
        credentials: 'omit',
        mode: 'cors',
        method: method
    }

    if(payload) {
        body = JSON.stringify(payload);
        headers['Content-Type'] = 'application/json';
        headers['Content-Length'] = new Blob([body]).size;
        fetchOptions.body = body;
    }

    fetchOptions.headers = headers;
    const response = await fetch(encodeURI(backendURL + endpoint), fetchOptions);
    const data = await response.json();

    if(response.status != 200) {
        throw data;
    }

    return data;
}

function getResourceURL(name) {
    return resourceBackendURL + name;
}

function getStartingAvatars() {
    return backendCall(endpoint_url('get_starting_avatars'));
}

function getGameInfo() {
    return backendCall(endpoint_url('get_game_info'));
}

async function createNewPlayer(name, playerId, avatar, vitalityBonus, weaponType) {
    const player = await backendCall(endpoint_url('create_new_player', 'platform=twitch'), 'PUT', {name, playerId, avatar, vitalityBonus, weaponType});
    frontendContext.setPlayer(player);
    return player;
}

function getPlayer(playerId, platform) {
    if (platform) {
        return backendCall(endpoint_url('get_player', 'platform=twitch', `playerId=${playerId}`));
    }
    return backendCall(endpoint_url('get_player', `playerId=${playerId}`));
}

async function joinGame(playerId, gameId) {
    cache.game = await backendCall(endpoint_url('join_game', `playerId=${playerId}`, `gameId=${gameId}`), 'POST');
    return cache.game;
}

function getGame(gameId) {
    return backendCall(endpoint_url('get_game', `gameId=${gameId}`));
}

function startBattle(playerId, gameId, monsterId, fallbackMonster) {
    return backendCall(endpoint_url('start_battle', `playerId=${playerId}`, `gameId=${gameId}`, `monsterId=${monsterId}`), 'POST', {fallbackMonster});
}

async function battleAction(battleId, actionRequest) {
    const queryStrings = [`battleId=${battleId}`, `actionType=${actionRequest.actionType}`];
    
    if(actionRequest.hasOwnProperty('abilityName')) {
        queryStrings.push(`abilityName=${actionRequest.abilityName}`);
    }
    else if(actionRequest.hasOwnProperty('itemId')) {
        queryStrings.push(`itemId=${actionRequest.itemId}`);
    }
    const battleUpdate = await backendCall(endpoint_url('battle_action', ...queryStrings), 'POST')
    frontendContext.setPlayer(battleUpdate.updatedPlayer);
    return battleUpdate;
}

async function equipWeapon(playerId, weaponId) {
    const player = await backendCall(endpoint_url('equip_weapon', `playerId=${playerId}`, `weaponId=${weaponId}`), 'POST');
    frontendContext.setPlayer(player);
    return player;
}

function dropWeapon(playerId, weaponId) {
    return backendCall(endpoint_url('drop_weapon', `playerId=${playerId}`, `weaponId=${weaponId}`), 'POST');
}

async function equipAbility(playerId, abilityBookId, abilityIndex, replacedAbilityName) {
    let player;
    if(replacedAbilityName) {
        player = await backendCall(endpoint_url('equip_ability', `playerId=${playerId}`, `abilityBookId=${abilityBookId}`, `abilityIndex=${abilityIndex}`, `replacedAbilityName=${replacedAbilityName}`), 'POST');    
    }
    else {
        player = await backendCall(endpoint_url('equip_ability', `playerId=${playerId}`, `abilityBookId=${abilityBookId}`, `abilityIndex=${abilityIndex}`), 'POST');
    }

    frontendContext.setPlayer(player);
    return player;
}

function dropBook(playerId, abilityBookName) {
    return backendCall(endpoint_url('drop_book', `playerId=${playerId}`, `abilityBookName=${abilityBookName}`), 'POST');
}

function dropItem(playerId, itemName) {
    return backendCall(endpoint_url('drop_item', `playerId=${playerId}`, `itemName=${itemName}`), 'POST');
}

async function getShop() {
    cache.shop = await backendCall(endpoint_url('get_shop', `shopId=daily`));
    return cache.shop;
}

async function buy(playerId, shopId, productId, amount=1) {
    const player = await backendCall(endpoint_url('buy', `playerId=${playerId}`, `shopId=${shopId}`, `productId=${productId}`, `amount=${amount}`), 'POST');
    frontendContext.setPlayer(player);
    return player;
}

async function moveObjectFromBagToInventory(playerId, objectId) {
    const player = await backendCall(endpoint_url('move_object_from_bag_to_inventory', `playerId=${playerId}`, `objectId=${objectId}`), 'POST');
    frontendContext.setPlayer(player);
    return player;
}

async function moveObjectFromInventoryToBag(playerId, pageId, objectId) {
    const collections = await backendCall(endpoint_url('move_object_from_inventory_to_bag', `playerId=${playerId}`, `pageId=${pageId}`, `objectId=${objectId}`), 'POST');
    frontendContext.setPlayer(collections.player);
    return collections;
}

async function claimObject(playerId, objectId) {
    const player = await backendCall(endpoint_url('claim_object', `playerId=${playerId}`, `objectId=${objectId}`), 'POST');
    frontendContext.setPlayer(player);
    return player;
}

async function getInventoryPage(playerId, pageId) {
    return backendCall(endpoint_url('get_inventory_page', `playerId=${playerId}`, `pageId=${pageId}`));
}

async function productPurchase(playerId, productSku, transactionReceipt) {
    const player = await backendCall(endpoint_url('product_purchase', `playerId=${playerId}`, `productSku=${productSku}`, `transactionReceipt=${transactionReceipt}`), 'POST');
    frontendContext.setPlayer(player);
    return player;
}

async function updateGame(gameId, mode) {
    const game = await backendCall(endpoint_url('updateGame', `gameId=${gameId}`, `mode=${mode}`), 'POST');
    return game;
}

/**
 * 
 * @param {string} playerId 
 * @param {string} objectId 
 * @param {{
 * itemLocation?: {type: string, source: {pageId?: string}}
 * }} [options] 
 * @returns {Promise<{
 * player: AgentData,
 * steps: BattleStep,
 * inventoryPage?: InventoryPageData
 * }>}
 */
async function useItem(playerId, objectId, options) {
    const result = await backendCall(endpoint_url('useItem', `playerId=${playerId}`, `objectId=${objectId}`), 'POST', options);
    frontendContext.setPlayer(result.player);
    return result;
}

const backend = {
    getResourceURL,
    getStartingAvatars,
    getGameInfo,
    createNewPlayer,
    getPlayer,
    joinGame,
    getGame,
    startBattle,
    battleAction,
    equipWeapon,
    dropWeapon,
    equipAbility,
    dropBook,
    dropItem,
    getShop,
    buy,
    moveObjectFromBagToInventory,
    moveObjectFromInventoryToBag,
    claimObject,
    getInventoryPage,
    productPurchase,
    updateGame,
    useItem,
    cache
};

export default backend;

/**
 * 
 * @typedef {Object} AgentActionData
 * @property {string} [type] - The action's type
 * @property {string} [style] - The action's style
 * @property {AbilityData} [addAbility]
 * 
 * @typedef {AgentActionData & {
 * elements?: string[], 
 * animation?: object,
 * }} AbilityActionData
 * 
 * @typedef {AbilityActionData & {
 * name: string,
 * apCost?: number,
 * postActions?: AbilityActionData[]
 * }} AbilityData
 * 
 * @typedef {Object} WeaponData
 * @property {string} name
 * @property {number} instanceNumber
 * @property {string} type
 * @property {string} style
 * @property {number} baseDamage
 * @property {number} speed
 * @property {AbilityData} strikeAbility
 * @property {Object} statGrowth
 * @property {string} description
 * @property {string} icon
 * 
 * @typedef {Object} CollectionContainer
 * @property {string} type
 * @property {string} id
 * @property {Object} content
 * 
 * @typedef {CollectionContainer[]} Collection
 * 
 * @typedef {Object} BagHolderData
 * @property {Object} bag
 * @property {{
 * objects: Collection[]
 * }} lastDrops
 * @property {number} coins
 * 
 * @typedef {Object} AgentData
 * @property {string} name
 * @property {string} id
 * @property {string} avatar
 * @property {WeaponData} weapon
 * @property {AbilityData[]} [abilities]
 * @property {number} autoRevive
 * @property {number} maxHealth
 * @property {number} health
 * @property {number} strength
 * @property {number} magic
 * @property {number} defense
 * @property {number} level
 * @property {number} exp
 * @property {number} ap
 * @property {number} expToNextLevel
 * @property {Object.<string, EffectData>} effectsMap
 * 
 * @typedef {AgentData & BagHolderData} PlayerData
 * 
 * @typedef {AgentData & {
 * talent: { maxHealth: number, strength: number, magic: number, defense: number}
 * }} MonsterData
 * 
 * @typedef {AgentData & {
 * maxAp: number
 * }} BattleAgentData
 * 
 * @typedef {Object} CollectionContainer
 * @property {string} type
 * @property {string} id
 * @property {Object} content
 * 
 * @typedef {Object} InventoryPageData
 * @property {CollectionContainer[]} objects
 * 
 * @typedef {{
 * count: number,
 * icon: string,
 * outOfBattle?: boolean
 * }} ItemData
 * 
 * @typedef {Object} EffectData
 * @property {string} targetId
 * @property {string} className
 * @property {Object} inputData
 * @property {string} [persistentId]
 * 
 * @typedef {Object} ImbueEffectData
 * @property {string} element
 * @property {number} roundsLeft 
 * 
 * @typedef {Object} BattleData
 * @property {EffectData[]} effects
 */
