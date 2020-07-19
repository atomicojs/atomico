import { h, Any } from "../../core/core";
import { customElementScope } from "../utils";

describe("properties", () => {
    it("transfer of prop to virtual-dom", async () => {
        let value = "10";

        function Wc({ value }) {
            return <host>{value}</host>;
        }

        Wc.props = {
            value: Number,
        };

        let node = customElementScope(Wc);

        document.body.appendChild(node);

        node.value = value;

        await node.updated;

        expect(node.textContent).toBe(value);

        node.value = value = value + value;

        await node.updated;

        expect(node.textContent).toBe(value);
    });
    it("property definition from the host tag", async () => {
        let cn = "my-class";

        function Wc({ cn }) {
            return <host class={cn}></host>;
        }

        Wc.props = {
            cn: String,
        };

        let node = customElementScope(Wc);

        document.body.appendChild(node);

        node.cn = cn;

        await node.updated;

        expect(node.className).toBe(cn);
    });
    it("schema Number", async () => {
        function Wc() {
            return <host />;
        }

        Wc.props = {
            value: Number,
        };

        let node = customElementScope(Wc);

        document.body.appendChild(node);

        await node.updated;

        node.setAttribute("value", "1000");

        await node.updated;

        expect(node.value).toBe(1000);
    });
    it("schema Any", async () => {
        function Wc() {
            return <host />;
        }

        Wc.props = {
            value: Any,
        };

        let node = customElementScope(Wc);

        let nextValue;
        document.body.appendChild(node);

        await node.updated;
        nextValue = 1000;
        node.value = nextValue;

        await node.updated;

        expect(node.value).toBe(nextValue);

        await node.updated;

        nextValue = Promise.resolve();
        node.value = nextValue;

        await node.updated;

        expect(node.value).toBe(nextValue);

        nextValue = () => 10;
        node.value = nextValue;

        await node.updated;

        expect(node.value).toBe(nextValue);
    });
    it("schema Object", async () => {
        function Wc() {
            return <host />;
        }

        Wc.props = {
            value: Object,
        };

        let node = customElementScope(Wc);
        let value = { value: 10 };

        document.body.appendChild(node);

        await node.updated;

        node.setAttribute("value", JSON.stringify(value));

        await node.updated;

        expect(node.value).toEqual(value);
    });

    it("schema Array", async () => {
        function Wc() {
            return <host />;
        }

        Wc.props = {
            value: Array,
        };

        let node = customElementScope(Wc);
        let value = [{ value: 10 }];

        document.body.appendChild(node);

        await node.updated;

        node.setAttribute("value", JSON.stringify(value));

        await node.updated;

        expect(node.value).toEqual(value);
    });

    it("schema String", async () => {
        function Wc() {
            return <host />;
        }

        Wc.props = {
            value: String,
        };

        let node = customElementScope(Wc);
        let value = "message";

        document.body.appendChild(node);

        await node.updated;

        node.setAttribute("value", value);

        await node.updated;

        expect(node.value).toBe(value);
    });
    it("schema Function, valid only as property", async () => {
        function Wc() {
            return <host />;
        }

        Wc.props = {
            value: Function,
        };

        let node = customElementScope(Wc);
        let value = () => "function";

        document.body.appendChild(node);

        await node.updated;

        node.value = value;

        await node.updated;

        expect(node.value).toBe(value);
    });
    it("schema Function, valid only as property", async () => {
        function Wc() {
            return <host />;
        }

        Wc.props = {
            value: Promise,
        };

        let node = customElementScope(Wc);

        let value = Promise.resolve();

        document.body.appendChild(node);

        await node.updated;

        node.value = value;

        await node.updated;

        expect(node.value).toBe(value);
    });
    it("schema Symbol, valid only as property", async () => {
        function Wc() {
            return <host />;
        }

        Wc.props = {
            value: Symbol,
        };

        let node = customElementScope(Wc);

        let value = Symbol();

        document.body.appendChild(node);

        await node.updated;

        node.value = value;

        await node.updated;

        expect(node.value).toBe(value);
    });
});
