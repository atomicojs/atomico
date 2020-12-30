export interface Hooks {
    load<T, S>(
        callback: S,
        param?: T
    ): S extends (arg?: any) => infer R ? R : T;
    clearEffect(unmounted?: boolean): () => void;
}
/**
 * create a scope for executing hooks without the need for components
 * @param render - function that receives updates dispatched by useState or useReducer
 * @param host - current for the useHost hook
 */
export function createHooks(render?: (result?: any) => any, host?: any): Hooks;
