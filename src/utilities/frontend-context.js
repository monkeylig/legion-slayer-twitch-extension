
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

    update(accountId, channelId) {
        this.#context.accountId = accountId;
        this.#context.channelId = channelId;
        //window.sessionStorage.setItem('accountId', accountId);
        //window.sessionStorage.setItem('channelId', channelId);
        this.#onContextReady?.();
    }

    onContextUpdated(updateFunc) {
        this.#updateFunc = updateFunc;
    }

    get() {
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
};

const frontendContext = new FrontendContext();
export default frontendContext