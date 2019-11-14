import { h } from "../../core/core";
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
});
