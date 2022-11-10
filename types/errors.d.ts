export class Error {
    target: HTMLElement;
    message: string;
    value: any;
    constructor(target: HTMLElement, message: string, value: unknown);
}

export class PropError extends Error {}

export class ParseError extends Error {}
