import * as elements from "./elements.js";

const { tags, ...constants } = elements;

class CustomElements {
    define(localName, element, options) {
        element.is = options?.extends;
        element.localName = localName;
        tags[localName] = element;
    }
    get(localName) {
        return tags[localName];
    }
}

class Document {
    createElement(localName) {
        if (tags[localName]) {
            const instance = new tags[localName]();
            instance.localName = localName;
            return instance;
        }
    }
}

export const customElements = new CustomElements();
export const document = new Document();

Object.assign(globalThis, {
    ...constants,
    document,
    customElements,
});
