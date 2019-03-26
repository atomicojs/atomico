interface options{
    document?:object,
    maxConcurrentTask?:number,
}

interface Context{
    Provider(props:object,context:object);
    Consumer(props:object,context:object);
}

interface setState{
    (nextState:any):void
}

interface ref{
    current:any;
}

interface Action{
    type : any,
    payload?:any
}

interface dispatch{
    (action:Action)
}

declare module "@atomico/core"{
    export let options:options;
    export function h(tag:string|Function,props?:object,...children:any):object;
    export function toList(children:any,map?:function):Array;
    export function render(vnode:object,node:HTMLElement|SVGElement|Text,disableHost?:boolean,customID?:string):void;
    export function createContext(value:any):Context;
    export function useState(initialState:any):[any,setState];
    export function useEffect(handler:Function,args?:any[]):void;
    export function useMemo(handler:Function,args:any[]):any;
    export function useReducer(reducer:Function,initialState:any):[any,dispatch];
    export function useRef(current:any):ref;
}