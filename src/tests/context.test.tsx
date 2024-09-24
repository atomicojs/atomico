import { expect, describe, it } from "vitest";
import { createContext, useContext } from "../context.js";
import { live } from "./element.test.js";
import { c } from "../element/custom-element.js";

describe("src/context", () => {
    it("createContext & useContext", async () => {
        let parentContext;
        const Provider = createContext({ message: "init value" });

        const MyElement = c(() => {
            const context = useContext(Provider);
            parentContext = context;
            return <host />;
        });

        const element = live(MyElement);
        const instance = live(Provider);

        instance.append(element);

        instance.value = { message: "new value" };

        await new Promise((resolve) => setTimeout(resolve, 200));

        expect(instance.value).to.deep.equal(parentContext);
    });
});
