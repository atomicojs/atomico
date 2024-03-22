export class Node {
    dispatchEvent() {}
}

export class Text extends Node {
    textContent = "";
}

export class Element extends Node {
    dataset = {};
}

export class CustomEvent extends Event {}

export class HTMLElement extends Element {}
export class HTMLAnchorElement extends HTMLElement {}
export class HTMLAreaElement extends HTMLElement {}
export class HTMLAudioElement extends HTMLElement {}
export class HTMLBaseElement extends HTMLElement {}
export class HTMLQuoteElement extends HTMLElement {}
export class HTMLBodyElement extends HTMLElement {}
export class HTMLBRElement extends HTMLElement {}
export class HTMLButtonElement extends HTMLElement {}
export class HTMLCanvasElement extends HTMLElement {}
export class HTMLTableCaptionElement extends HTMLElement {}
export class HTMLTableColElement extends HTMLElement {}
export class HTMLDataElement extends HTMLElement {}
export class HTMLDataListElement extends HTMLElement {}
export class HTMLModElement extends HTMLElement {}
export class HTMLDetailsElement extends HTMLElement {}
export class HTMLDialogElement extends HTMLElement {}
export class HTMLDirectoryElement extends HTMLElement {}
export class HTMLDivElement extends HTMLElement {}
export class HTMLDListElement extends HTMLElement {}
export class HTMLEmbedElement extends HTMLElement {}
export class HTMLFieldSetElement extends HTMLElement {}
export class HTMLFontElement extends HTMLElement {}
export class HTMLFormElement extends HTMLElement {}
export class HTMLFrameElement extends HTMLElement {}
export class HTMLFrameSetElement extends HTMLElement {}
export class HTMLHeadingElement extends HTMLElement {}
export class HTMLHeadElement extends HTMLElement {}
export class HTMLHRElement extends HTMLElement {}
export class HTMLIFrameElement extends HTMLElement {}
export class HTMLImageElement extends HTMLElement {}
export class HTMLInputElement extends HTMLElement {}
export class HTMLLabelElement extends HTMLElement {}
export class HTMLLegendElement extends HTMLElement {}
export class HTMLLIElement extends HTMLElement {}
export class HTMLLinkElement extends HTMLElement {}
export class HTMLMapElement extends HTMLElement {}
export class HTMLMarqueeElement extends HTMLElement {}
export class HTMLMenuElement extends HTMLElement {}
export class HTMLMetaElement extends HTMLElement {}
export class HTMLMeterElement extends HTMLElement {}
export class HTMLObjectElement extends HTMLElement {}
export class HTMLOListElement extends HTMLElement {}
export class HTMLOptGroupElement extends HTMLElement {}
export class HTMLOptionElement extends HTMLElement {}
export class HTMLOutputElement extends HTMLElement {}
export class HTMLParagraphElement extends HTMLElement {}
export class HTMLParamElement extends HTMLElement {}
export class HTMLPictureElement extends HTMLElement {}
export class HTMLPreElement extends HTMLElement {}
export class HTMLProgressElement extends HTMLElement {}
export class HTMLScriptElement extends HTMLElement {}
export class HTMLSelectElement extends HTMLElement {}
export class HTMLSlotElement extends HTMLElement {}
export class HTMLSourceElement extends HTMLElement {}
export class HTMLSpanElement extends HTMLElement {}
export class HTMLStyleElement extends HTMLElement {}
export class HTMLTableElement extends HTMLElement {}
export class HTMLTableSectionElement extends HTMLElement {}
export class HTMLTemplateElement extends HTMLElement {}
export class HTMLTextAreaElement extends HTMLElement {}
export class HTMLTableCellElement extends HTMLElement {}
export class HTMLTimeElement extends HTMLElement {}
export class HTMLTitleElement extends HTMLElement {}
export class HTMLTableRowElement extends HTMLElement {}
export class HTMLTrackElement extends HTMLElement {}
export class HTMLUListElement extends HTMLElement {}
export class HTMLVideoElement extends HTMLElement {}
export class Image extends HTMLImageElement {}

export const tags = {
    style: HTMLStyleElement
};
