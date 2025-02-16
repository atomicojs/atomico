import { c, useEffect, useState, useUpdate } from "atomico";

export const EgUseEffect = c(
    () => {
        return <host shadowDom>Form!</host>;
    },
    {
        form: true
    }
);

customElements.define("eg-use-internals", EgUseEffect);
