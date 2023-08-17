import { expect } from "@esm-bundle/chai";
import { html } from "../../html.js";
import { createType } from "../element/custom-element.js";
import { customElementScope } from "./element.test.js";

describe("src/element/create-type", () => {
    it("createType", async () => {
        const TypeAlwaysArray = createType((value) =>
            Array.isArray(value) ? value : [value]
        );

        function component() {
            return html`<host />`;
        }

        component.props = {
            array: TypeAlwaysArray,
        };

        const instance = customElementScope(component);

        document.body.append(instance);

        instance.array = 10;

        await instance.updated;

        expect(instance.array).to.deep.equal([10]);
    });
    it("createType: schema", async () => {
        const TypeAlwaysArray = createType((value) =>
            Array.isArray(value) ? value : [value]
        );

        function component() {
            return html`<host />`;
        }

        component.props = {
            array: {
                type: TypeAlwaysArray,
            },
        };

        const instance = customElementScope(component);

        document.body.append(instance);

        instance.array = 10;

        await instance.updated;

        expect(instance.array).to.deep.equal([10]);
    });
    it("createType: schema serialize", async () => {
        const TypeAlwaysArray = createType((value) =>
            Array.isArray(value) ? value : [value]
        );

        function component() {
            return html`<host />`;
        }

        component.props = {
            array: {
                type: TypeAlwaysArray,
                reflect: true,
            },
        };

        const instance = customElementScope(component);

        document.body.append(instance);

        instance.array = 10;

        await instance.updated;

        expect(instance.getAttribute("array")).to.deep.equal("[10]");
    });
    it("createType: schema custom serialize", async () => {
        const toString = (value) => `data:${JSON.stringify(value)}`;

        const TypeAlwaysArray = createType(
            (value) => (Array.isArray(value) ? value : [value]),
            toString
        );

        function component() {
            return html`<host />`;
        }

        component.props = {
            array: {
                type: TypeAlwaysArray,
                reflect: true,
            },
        };

        const instance = customElementScope(component);

        document.body.append(instance);

        instance.array = 10;

        await instance.updated;

        expect(instance.getAttribute("array")).to.deep.equal(toString([10]));
    });
});
