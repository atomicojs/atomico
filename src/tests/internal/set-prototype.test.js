import { expect } from "@esm-bundle/chai";
import {
    setPrototype,
    filterValue,
    reflectValue,
    getAttr,
} from "../../element/set-prototype";

describe("internal: getAttr", () => {
    it("check getAttr", () => {
        expect(getAttr("myAttributeOk")).to.equal("my-attribute-ok");

        expect(getAttr("myattribute")).to.equal("myattribute");
    });
});

describe("internal: reflectValue", () => {
    it("check reflectValue", () => {
        const host = document.createElement("div");

        reflectValue(host, String, "data-value", "check");

        expect(host.dataset.value).to.equal("check");

        reflectValue(host, String, "data-value", null);

        expect(host.dataset.value).to.equal(undefined);

        //

        reflectValue(host, Boolean, "data-value", true);

        expect(host.dataset.value).to.equal("");

        reflectValue(host, Boolean, "data-value", false);

        expect(host.dataset.value).to.equal(undefined);

        //

        reflectValue(host, Object, "data-value", { id: 0 });

        expect(host.dataset.value).to.equal(`{"id":0}`);

        reflectValue(host, Object, "data-value", null);

        expect(host.dataset.value).to.equal(undefined);
    });
});

describe("internal: filterValue", () => {
    it("check types", () => {
        const items = [
            {
                type: Number,
                success: [0, new Number(0)],
                error: [new Number(NaN)],
            },
            {
                type: String,
                success: ["", new String("")],
            },
            {
                type: Boolean,
                success: [false, true, new Boolean()],
            },
            {
                type: Object,
                success: [{}, new Object(), new (class {})()],
            },
            {
                type: Array,
                success: [[], new Array()],
            },
            {
                type: Node,
                success: [
                    new Text(),
                    new Image(),
                    document.createElement("div"),
                ],
            },
            {
                type: File,
                success: [new File([], "")],
            },
            {
                type: Promise,
                success: [
                    new Promise(() => {}),
                    Promise.resolve(),
                    Promise.reject(),
                ],
            },
            {
                type: Symbol,
                success: [Symbol("ok"), Symbol.for("ok2")],
            },
            {
                type: Date,
                success: [new Date()],
            },
        ];

        items.forEach(({ type, success, error }) => {
            success.forEach((value) =>
                expect(filterValue(type, value)).to.deep.equal({
                    value: value,
                    error: false,
                })
            );

            items
                .filter((item) => item.type != type)
                .map(({ success }) => success)
                .flat()
                .concat(error || [])
                .forEach((value) =>
                    expect(filterValue(type, value)).to.deep.equal(
                        value === ""
                            ? {
                                  value: undefined,
                                  error: false,
                              }
                            : {
                                  value: value,
                                  error: true,
                              }
                    )
                );
        });

        items.forEach(({ success }) =>
            success.forEach((value) =>
                expect(filterValue(null, value)).to.deep.equal({
                    value: value,
                    error: false,
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

        expect(attrs).to.deep.equal({ value: { prop: "value", type: Number } });
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
                value: 1000,
            },
            attrs,
            values
        );

        expect(attrs).to.deep.equal({ value: { type: Number, prop: "value" } });
        expect(values).to.deep.equal({ value: 1000 });
    });
});
