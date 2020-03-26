import { h, Any } from "../../core/core";
import { customElementScope } from "../utils";

describe("properties", () => {
    it("transfer of prop to virtual-dom", async () => {
        let value = "10";

        function Wc({ value }) {
            return <host>{value}</host>;
        }

        Wc.props = {
            value: Number
        };

        let node = customElementScope(Wc);

        document.body.appendChild(node);

        node.value = value;

        await node.rendered;

        expect(node.textContent).toBe(value);

        node.value = value = value + value;

        await node.rendered;

        expect(node.textContent).toBe(value);
    });
    it("property definition from the host tag", async () => {
        let cn = "my-class";

        function Wc({ cn }) {
            return <host class={cn}></host>;
        }

        Wc.props = {
            cn: String
        };

        let node = customElementScope(Wc);

        document.body.appendChild(node);

        node.cn = cn;

        await node.rendered;

        expect(node.className).toBe(cn);
    });
    it("schema Number", async () => {
        function Wc() {
            return "";
        }

        Wc.props = {
            value: Number
        };

        let node = customElementScope(Wc);

        document.body.appendChild(node);

        await node.rendered;

        node.setAttribute("value", "1000");

        await node.rendered;

        expect(node.value).toBe(1000);
    });
    it("schema Any", async () => {
        function Wc() {
            return "";
        }

        Wc.props = {
            value: Any
        };

        let node = customElementScope(Wc);

        let nextValue;
        document.body.appendChild(node);

        await node.rendered;
        nextValue = 1000;
        node.value = nextValue;

        await node.rendered;

        expect(node.value).toBe(nextValue);

        await node.rendered;

        nextValue = Promise.resolve();
        node.value = nextValue;

        await node.rendered;

        expect(node.value).toBe(nextValue);
    });
    it("schema Object", async () => {
        function Wc() {
            return "";
        }

        Wc.props = {
            value: Object
        };

        let node = customElementScope(Wc);
        let value = { value: 10 };

        document.body.appendChild(node);

        await node.rendered;

        node.setAttribute("value", JSON.stringify(value));

        await node.rendered;

        expect(node.value).toEqual(value);
    });

    it("schema Array", async () => {
        function Wc() {
            return "";
        }

        Wc.props = {
            value: Array
        };

        let node = customElementScope(Wc);
        let value = [{ value: 10 }];

        document.body.appendChild(node);

        await node.rendered;

        node.setAttribute("value", JSON.stringify(value));

        await node.rendered;

        expect(node.value).toEqual(value);
    });

    it("schema String", async () => {
        function Wc() {
            return "";
        }

        Wc.props = {
            value: String
        };

        let node = customElementScope(Wc);
        let value = "message";

        document.body.appendChild(node);

        await node.rendered;

        node.setAttribute("value", value);

        await node.rendered;

        expect(node.value).toBe(value);
    });
    it("schema Function, valid only as property", async () => {
        function Wc() {
            return "";
        }

        Wc.props = {
            value: Function
        };

        let node = customElementScope(Wc);
        let value = () => "function";

        document.body.appendChild(node);

        await node.rendered;

        node.value = value;

        await node.rendered;

        expect(node.value).toBe(value);
    });
    it("schema Function, valid only as property", async () => {
        function Wc() {
            return "";
        }

        Wc.props = {
            value: Promise
        };

        let node = customElementScope(Wc);

        let value = Promise.resolve();

        document.body.appendChild(node);

        await node.rendered;

        node.value = value;

        await node.rendered;

        expect(node.value).toBe(value);
    });
    it("schema Symbol, valid only as property", async () => {
        function Wc() {
            return "";
        }

        Wc.props = {
            value: Symbol
        };

        let node = customElementScope(Wc);

        let value = Symbol();

        document.body.appendChild(node);

        await node.rendered;

        node.value = value;

        await node.rendered;

        expect(node.value).toBe(value);
    });

    it("schema options", async () => {
        function Wc() {
            return "";
        }

        Wc.props = {
            value: {
                type: Number,
                options: [1, 2, 3, 4, 5]
            }
        };

        let node = customElementScope(Wc);

        let value = 1;

        document.body.appendChild(node);

        await node.rendered;

        node.value = value;

        await node.rendered;

        expect(node.value).toBe(value);

        try {
            node.value = 100;
        } catch (e) {
            expect(node.value).toBe(value);
        }
    });
});
