import { c, useFormProps, useFormValidity, useRef, useState } from "atomico";
import { delegateValidity } from "atomico/utils";

const MyInput = c(
    () => {
        const [value = "", setValue] = useFormProps();
        const ref = useRef<HTMLInputElement>();
        const [message, validity] = useFormValidity(
            () => delegateValidity(ref.current),
            [value]
        );

        return (
            <host shadowDom={{ delegatesFocus: true }}>
                <input
                    value={value}
                    ref={ref}
                    oninput={({ currentTarget }) => {
                        setValue(currentTarget.value);
                    }}
                    required
                    minLength={3}
                />
            </host>
        );
    },
    {
        form: true,
        props: {
            name: String,
            value: String
        }
    }
);

const MyLogin = c(() => {
    const [data, setData] = useState();
    return (
        <host>
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
});

customElements.define("my-input", MyInput);
customElements.define("my-login", MyLogin);
