import { expect } from "@esm-bundle/chai";
import { setup } from "../../element/setup";

describe("internal: setup", () => {
    it("setup", () => {
        const Component = () => {};
        class MyElement extends HTMLElement {
            /**@this import("../../element/custom-element").BaseContext */
            constructor() {
                super();
                this._props = {};
                this.mounted = Promise.resolve();
                this.unmounted = new Promise(() => {});
                setup(this, Component);
                expect(this.update).is.call;
            }
        }
    });
});
