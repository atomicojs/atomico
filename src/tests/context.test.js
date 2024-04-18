import { expect } from "@esm-bundle/chai";
import { createContext, useContext } from "../context.js";
import { customElementScope } from "./element.test.js";

describe("src/context", () => {
    it("createContext & useContext", async () => {
        let parentContext;
        const Provider = createContext({ message: "init value" });

        const element = customElementScope(() => {
            const context = useContext(Provider);
            parentContext = context;
            return null;
        });
        const instance = customElementScope(Provider, false);

        instance.append(element);

        document.body.append(instance);

        instance.value = { message: "new value" };

        await new Promise((resolve) => setTimeout(resolve, 200));

        expect(instance.value).to.deep.equal(parentContext);
    });
});
