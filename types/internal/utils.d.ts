export type IsFunction = (param: any) => param is (...args: any[]) => any;

export type AddListener = <Target extends EventTarget>(
    target: Target,
    type: string,
    listener: (event: unknown) => any,
    options?: AddEventListenerOptions | boolean
) => () => void;
