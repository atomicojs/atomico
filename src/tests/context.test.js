import { expect } from "@esm-bundle/chai";
import { createContext, useContext } from "../context.js";
import { customElementScope } from "./element.test.js";
import { createHooks } from "../hooks/create-hooks.js";

describe("src/context", () => {
    it("createContext & useContext", async () => {
        const Provider = createContext({ value: "init value" });
        const instance = customElementScope(Provider, false);
        document.body.append(instance);
        expect(instance.value).to.deep.equal({ value: "init value" });

        instance.value = { value: "new value" };

        await instance.updated;

        expect(instance.value).to.deep.equal({ value: "new value" });

        instance.dispatchEvent(
            new CustomEvent("ConnectContext", {
                bubbles: true,
                composed: true,
                detail: {
                    context: Provider,
                    connect(element) {
                        expect(element).to.equal(instance);
                    }
                }
            })
        );

        const hooks = createHooks(() => {}, instance);

        const value = hooks.load(() => useContext(Provider));

        expect(value).to.deep.equal({ value: "new value" });

        hooks.cleanEffects()()();

        hooks.cleanEffects(true)()();
    });

    it("useContext", () => {
        const Provider = createContext({ value: "init value" });

        customElements.define("use-context-provider", Provider);

        const hooks = createHooks(() => {}, new Text(""));

        const value = hooks.load(() => useContext(Provider));

        expect(value).to.deep.equal({ value: "init value" });

        hooks.cleanEffects()()();

        hooks.cleanEffects(true)()();
    });
});
