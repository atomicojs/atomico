import { html, c } from "../../../core.js";
import { Component2 } from "./component-2.js";
import { Component3 } from "./component-3.js";
import { Component4 } from "./component-4.js";

function component() {
    return html`<host>
        ${1} ${2} ${3}
        <button>ok</button>
        <${Component2} count=${10} />
        <${Component3} data=${{ ok: 1 }} />
        <${Component4} count=${100} />
    </host>`;
}

customElements.define("component-1", c(component));
