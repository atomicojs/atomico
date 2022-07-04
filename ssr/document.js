import * as elements from "./elements.js";
import { IS, NAME } from "./constants.js";
import { isServer } from "./utils.js";

const { tags, ...constants } = elements;

class CustomElements {
    define(localName, element, options) {
        element[IS] = options?.extends;
        element[NAME] = localName;
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

const context = {
    ...constants,
    document: new Document(),
    customElements: new CustomElements(),
};

if (isServer()) {
    for (let prop in context) {
        if (!globalThis[prop]) {
            globalThis[prop] = context[prop];
        } else if (prop === "customElements") {
            const { define } = customElements;
            customElements.define = function (localName, element, options) {
                element[IS] = options?.extends;
                element[NAME] = localName;
                define.call(this, localName, element, options);
            };
        }
    }
}
