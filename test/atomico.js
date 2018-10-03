import { h, Element } from "../dist/atomico.m.js";

describe("Lifecycle", () => {
    it("elementMount", done => {
        class Tag extends Element {
            elementMount() {
                assert.equal(this.innerHTML, `<div>hola!</div>`);
                done();
            }
            render() {
                return <div>hola!</div>;
            }
        }

        customElements.define("tag-test-1", Tag);

        let tag = document.createElement("tag-test-1");

        document.body.appendChild(tag);
    });

    it("elementMount and props", done => {
        let value = "hello!";

        class Tag extends Element {
            static get props() {
                return ["prop-1"];
            }
            elementMount() {
                assert.equal(this.props.prop1, value);
                done();
            }
            render() {
                return <div>hola!</div>;
            }
        }

        customElements.define("tag-test-2", Tag);

        let tag = document.createElement("tag-test-2");

        tag.setAttribute("prop-1", value);
        document.body.appendChild(tag);
    });
});
