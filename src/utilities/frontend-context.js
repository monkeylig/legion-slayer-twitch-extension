
class FrontendContext {
    #context = {};
    #frontendContextPromise;
    #onContextReady;
    #updateFunc;

    constructor() {
        this.#frontendContextPromise = new Promise((resolve, reject) => {
            this.#onContextReady = () => {
                this.#updateFunc?.();
                resolve();
            };
        });
    }

    update(accountId, channelId, token) {
        this.#context.accountId = accountId;
        this.#context.channelId = channelId;
        this.#context.token = token;
        //window.sessionStorage.setItem('accountId', accountId);
        //window.sessionStorage.setItem('channelId', channelId);
        this.#onContextReady?.();
    }

    onContextUpdated(updateFunc) {
        this.#updateFunc = updateFunc;
    }

    get() {
        if(!this.#context.player) {
            this.#context.player = {
                bag: {
                    capacity: 10,
                    objects: []
                },
                lastDrops: {
                    objects: []
                },
                inventory: {
                    leger: []
                },
                abilities: [],
                weapon: {},
                trackers: {
                    weaponKills: {},
                },
                coins: 0
            };
        }
        return this.#context;
    }

    setPlayer(player) {
        this.#context.player = player;
    }

    async wait() {
        await this.#frontendContextPromise;
    }

    isBitsEnabled() {
        return window.Twitch.ext.features.isBitsEnabled;
    }

    getProducts() {
        return window.Twitch.ext.bits.getProducts();
    }

    useBits(sku) {
        window.Twitch.ext.bits.useBits(sku);
    }

    onTransactionComplete(transactionFunc) {
        window.Twitch.ext.bits.onTransactionComplete(transactionObject => {
            transactionFunc?.(transactionObject);
        });
    }

    onTransactionCancelled(transactionFunc) {
        window.Twitch.ext.bits.onTransactionCancelled(() => {
            transactionFunc?.();
        });
    }

    /**
     * 
     * @returns {boolean}
     */
    hasTwitchContext() {
        return window.Twitch
    }

    get viewerId() {
        if (!this.hasTwitchContext()) {
            return '963595820';
        }

        return window.Twitch.ext.viewer.id;
    }
};

const frontendContext = new FrontendContext();
export default frontendContext