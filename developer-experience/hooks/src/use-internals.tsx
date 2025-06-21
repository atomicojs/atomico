import {
    c,
    useFormProps,
    useFormValidity,
    useRef,
    useState,
    css
} from "atomico";
import { delegateValidity } from "atomico/utils";

const MyInput = c(
    ({ name }) => {
        const [value = "", setValue] = useFormProps();
        const ref = useRef<HTMLInputElement>();
        const [, validity] = useFormValidity(
            () => delegateValidity(ref.current),
            [value]
        );

        return (
            <host shadowDom={{ delegatesFocus: true }}>
                <label>
                    <span>
                        {!validity.valid && "🔴"}
                        {name}
                    </span>
                    <input
                        value={value}
                        ref={ref}
                        oninput={({ currentTarget }) => {
                            setValue(currentTarget.value);
                        }}
                        required
                        minLength={3}
                    />
                </label>
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
            }
            label {
                display: grid;
                padding: 0.5rem 0;
                box-sizing: border-box;
            }
        `
    }
);

const MyLogin = c(
    () => {
        const [data, setData] = useState();
        return (
            <host shadowDom>
                <form
                    oninput={({ currentTarget }) => {
                        setData(
                            Object.fromEntries(
                                new FormData(currentTarget as HTMLFormElement)
                            )
                        );
                    }}
                >
                    <MyInput name="user" />
                    <MyInput name="password" />
                    <button type="submit">Login</button>
                </form>
                <hr />
                <code>{JSON.stringify(data)}</code>
            </host>
        );
    },
    {
        styles: css`
            :host {
                display: grid;
            }
        `
    }
);

customElements.define("my-input", MyInput);
customElements.define("my-login", MyLogin);
