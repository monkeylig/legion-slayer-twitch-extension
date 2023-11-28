
class FrontendContext {
    #context = {};
    #frontendContextPromise;
    constructor() {
        this.#frontendContextPromise = new Promise((resolve, reject) => {
            this.onContextReady = () => {
                resolve();
            };
        })

    }

    update(accountId, channelId) {
        this.#context.accountId = accountId;
        this.#context.channelId = channelId;
        //window.sessionStorage.setItem('accountId', accountId);
        //window.sessionStorage.setItem('channelId', channelId);
        if(this.onContextReady) {
            this.onContextReady();
        }
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
};

const frontendContext = new FrontendContext();
export default frontendContext