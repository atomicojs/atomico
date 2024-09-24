import { describe, expect, it } from "vitest";
import { c, createType } from "../element/custom-element.js";
import { live } from "./element.test.js";

describe("src/element/create-type", () => {
    it("createType", async () => {
        const TypeAlwaysArray = createType((value) =>
            Array.isArray(value) ? value : [value]
        );

        const props = {
            array: TypeAlwaysArray
        };

        const MyElement = c(() => <host />, { props });

        const instance = live(MyElement);

        instance.array = 10;

        await instance.updated;

        expect(instance.array).to.deep.equal([10]);
    });

    it("createType: schema", async () => {
        const TypeAlwaysArray = createType((value) =>
            Array.isArray(value) ? value : [value]
        );

        const props = {
            array: {
                type: TypeAlwaysArray
            }
        };

        const MyElement = c(() => <host />, { props });

        const instance = live(MyElement);

        instance.array = 10;

        await instance.updated;

        expect(instance.array).to.deep.equal([10]);
    });

    it("createType: schema serialize", async () => {
        const TypeAlwaysArray = createType((value) =>
            Array.isArray(value) ? value : [value]
        );

        const props = {
            array: {
                type: TypeAlwaysArray,
                reflect: true
            }
        };

        const MyElement = c(() => <host />, { props });

        const instance = live(MyElement);

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

        const props = {
            array: {
                type: TypeAlwaysArray,
                reflect: true
            }
        };

        const MyElement = c(() => <host />, { props });

        const instance = live(MyElement);

        instance.array = 10;

        await instance.updated;

        expect(instance.getAttribute("array")).to.deep.equal(toString([10]));
    });
});
