export class PropError {
    /**
     *
     * @param {HTMLElement} target
     * @param {string} message
     * @param {string} value
     */
    constructor(target, message, value) {
        this.message = message;
        this.target = target;
        this.value = value;
    }
}
