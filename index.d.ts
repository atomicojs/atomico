import VDom from "./src/vdom/vdom";

declare module "atomico"{
    export function h(tag:string,attrs:Object,...children:any[] ):VDom
    export class Component extends HTMLElement{
        state:Object;
        props:Object;
        _props:string[];
        _render:VDom[];
        dispatch(type:string,detail:any):void
        setState(next:Object):void
    }
}