export class RenderError {
    /**
     *
     * @param {HTMLElement} target
     * @param {string} message
     */
    constructor(target, message) {
        this.message = message;
        this.target = target;
    }
}

export class PropError extends RenderError {
    /**
     *
     * @param {HTMLElement} target
     * @param {string} message
     * @param {string} value
     */
    constructor(target, message, value) {
        super(target, message);
        this.value = value;
    }
}
