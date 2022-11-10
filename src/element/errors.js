export class Error {
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

export class PropError extends Error {}

export class ParseError extends Error {}
