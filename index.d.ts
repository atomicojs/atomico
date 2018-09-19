import VDom from "./src/vdom";

interface Slots{
    [key:string] : HTMLElement | SVGAElement
}

type Tag = String | HTMLElement | SVGAElement;

declare module "atomico"{
    export function h(tag:Tag,attrs:Object,...children:any):VDom
    export class Component extends HTMLElement{
        state:Object;
        props:Object;
        _props:string[];
        _render:VDom[];
        _prevent:boolean;
        _mount:boolean;
        fragment : document.createDocumentFragment;
        slots : Slots;
        setAttribute(props:string,value:any):void;
        connectedCallback():void;
        disconnectedCallback():void;
        attributeChangedCallback():void;
        addEventListener(type:string,handler:Function,useCapture?:boolean):void;
        dispatch(type:string,detail:any):void;
        setState(next:Object,ignoreUpdate?:boolean):void;
        setProps(props:Object):void;
        render():Any;
    }
}