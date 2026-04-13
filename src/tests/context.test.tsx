import { expect, describe, it } from "vitest";
import { createContext, useContext } from "../context.js";
import { live } from "./element.test.js";
import { c } from "../element/custom-element.js";
import { delay } from "../hooks/tests/utils.js";

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
        await delay(); // Wait for mounted effects to register listeners

        instance.value = { message: "new value" };
        await delay(); // Wait for the update listener to trigger re-render

        expect(instance.value).to.deep.equal(parentContext);
    });
});
