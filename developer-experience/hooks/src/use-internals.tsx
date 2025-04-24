import {
    c,
    css,
    useFormValue,
    useFormValidity,
    useFormSubmit,
    useFormDisabled
} from "atomico";

export const Example = c(
    ({ name }) => {
        const [state, setFormValue] = useFormValue(name);
        const [message, , setFormValidity] = useFormValidity();

        const [value1, setValue1] = useFormProp<string>("message");

        useFormSubmit((event) => !state && setFormValidity("Required"), {
            once: true
        });

        useFormDisabled(() => {
            console.log("Disabled!");
        });

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
            value: {
                type: String
            }
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
