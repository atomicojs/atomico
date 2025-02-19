import { c, useEffect, useHost, useState, useUpdate } from "atomico";

export const EgUseEffect = c(
    () => {
        const { current } = useHost();
        const [internal] = useState(() => current.attachInternals());
        return (
            <host shadowDom>
                Form!
                <input
                    type="text"
                    oninput={({ currentTarget }) => {
                        const form = new FormData();
                        form.append("mi-text", `${currentTarget.value}`);
                        internal.setFormValue(form);
                    }}
                />
                <button
                    onclick={() => {
                        internal.setValidity(
                            { valueMissing: true },
                            "my message"
                        );
                        internal.reportValidity();
                    }}
                >
                    message
                </button>
                <button
                    onclick={() => {
                        console.log(internal.checkValidity());
                    }}
                >
                    check
                </button>
            </host>
        );
    },
    {
        form: true
    }
);

customElements.define("eg-use-internals", EgUseEffect);
