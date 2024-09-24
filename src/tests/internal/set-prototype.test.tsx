import { describe, expect, it } from "vitest";
import {
    filterValue,
    getAttr,
    reflectValue,
    setPrototype
} from "../../element/set-prototype.js";

describe("internal: getAttr", () => {
    it("check getAttr", () => {
        expect(getAttr("myAttributeOk")).toEqual("my-attribute-ok");

        expect(getAttr("myattribute")).toEqual("myattribute");
    });
});

describe("internal: reflectValue", () => {
    it("check reflectValue", () => {
        const host = document.createElement("div");

        reflectValue(host, String, "data-value", "check");

        expect(host.dataset.value).toEqual("check");

        reflectValue(host, String, "data-value", null);

        expect(host.dataset.value).toEqual(undefined);

        reflectValue(host, Boolean, "data-value", true);

        expect(host.dataset.value).toEqual("");

        reflectValue(host, Boolean, "data-value", false);

        expect(host.dataset.value).toEqual(undefined);

        reflectValue(host, Object, "data-value", { id: 0 });

        expect(host.dataset.value).toEqual(`{"id":0}`);

        reflectValue(host, Object, "data-value", null);

        expect(host.dataset.value).toEqual(undefined);
    });
});

describe("internal: filterValue", () => {
    it("check types", () => {
        const items = [
            {
                type: Number,
                success: [0, new Number(0)],
                error: [new Number(NaN)]
            },
            {
                type: String,
                success: ["", new String("")]
            },
            {
                type: Boolean,
                success: [false, true, new Boolean()]
            },
            {
                type: Object,
                success: [{}, new Object(), new (class {})()]
            },
            {
                type: Array,
                success: [[], new Array()]
            },
            {
                type: Node,
                success: [
                    new Text(),
                    new Image(),
                    document.createElement("div")
                ]
            },
            {
                type: File,
                success: [new File([], "")]
            },
            {
                type: Promise,
                success: [
                    new Promise(() => {}),
                    Promise.resolve(),
                    Promise.reject()
                ]
            },
            {
                type: Symbol,
                success: [Symbol("ok"), Symbol.for("ok2")]
            },
            {
                type: Date,
                success: [new Date()]
            }
        ];

        items.forEach(({ type, success, error }) => {
            success.forEach((value) =>
                expect(filterValue(type, value)).toEqual({
                    value: value,
                    error: false
                })
            );

            items
                .filter((item) => item.type != type)
                .map(({ success }) => success)
                .flat()
                .concat(error || [])
                .forEach((value) =>
                    expect(filterValue(type, value)).toEqual(
                        value === ""
                            ? {
                                  value: undefined,
                                  error: false
                              }
                            : {
                                  value: value,
                                  error: true
                              }
                    )
                );
        });

        items.forEach(({ success }) =>
            success.forEach((value) =>
                expect(filterValue(null, value)).toEqual({
                    value: value,
                    error: false
                })
            )
        );
    });
});

describe("internal: setPrototype", () => {
    it("declare basic", () => {
        class MyElement extends HTMLElement {}
        /**
         * @type {Object<string,string>}
         */
        const attrs = {};
        const values = {};

        setPrototype(MyElement.prototype, "value", Number, attrs, values);

        expect(attrs).toEqual({ value: { prop: "value", type: Number } });
    });

    it("declare shema", () => {
        class MyElement extends HTMLElement {}
        /**
         * @type {Object<string,string>}
         */
        const attrs = {};
        const values = {};

        setPrototype(
            MyElement.prototype,
            "value",
            {
                type: Number,
                value: 1000
            },
            attrs,
            values
        );

        expect(attrs).toEqual({ value: { type: Number, prop: "value" } });
        expect(values).toEqual({ value: 1000 });
    });
});
