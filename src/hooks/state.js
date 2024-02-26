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
    /**
     * The following code allows a mutable approach to useState
     * and useProp this with the idea of allowing an alternative
     * approach similar to Vue or Qwik of state management
     * @todo pending review with the community
     */
    // get value() {
    //     return this[0];
    // }
    // set value(nextState) {
    //     this[2](nextState, this);
    // }
}
