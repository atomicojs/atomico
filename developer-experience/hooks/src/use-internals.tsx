import { c, css, useFormValue, useFormValidity, useFormSubmit } from "atomico";

export const Example = c(
    ({ name, value }) => {
        const [, setFormValue] = useFormValue(name);
        const [message, { valid }, setFormValidity] = useFormValidity();

        useFormSubmit((event) => setFormValidity("Required"), { once: true });

        return (
            <host shadowDom={{ delegatesFocus: true }}>
                <input
                    type="text"
                    oninput={({ currentTarget: { value } }) => {
                        setFormValue(value);
                        if (value) {
                            if (value === "atomico") {
                                setFormValidity();
                            } else {
                                setFormValidity("Write atomico");
                            }
                        } else {
                            setFormValidity("Field requiered");
                        }
                    }}
                />
                <span>{message}</span>
                <button
                    onclick={() => {
                        setFormValidity("Error!", {
                            valueMissing: true,
                            report: true
                        });
                    }}
                >
                    Report
                </button>
            </host>
        );
    },
    {
        form: true,
        props: {
            name: String,
            value: String
        },
        styles: css`
            :host {
                display: block;
                background: yellowgreen;
            }
            :host(:invalid) {
                background: red;
            }
        `
    }
);

customElements.define("my-example", Example);
