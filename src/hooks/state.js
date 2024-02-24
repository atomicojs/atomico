export class State extends Array {
    /**
     *
     * @param {any} initialState
     * @param {(nextState: any, state:any[], mount: boolean )=>void} mapState
     */
    constructor(initialState, mapState) {
        let mount = true;
        /**
         *
         * @param {any} nextState
         */
        const setState = (nextState) => {
            try {
                mapState(nextState, this, mount);
            } finally {
                mount = false;
            }
        };
        super(undefined, setState, mapState);
        setState(initialState);
    }
    get value() {
        return this[0];
    }
    set value(nextState) {
        this[2](nextState, this);
    }
}
