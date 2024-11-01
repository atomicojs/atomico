import { c } from "atomico";

export const MyComponent = c(
    (props) => (
        <host shadowDom>
            <h1>{props.value1?.search("welcome")}</h1>
            <h1>{props.value2?.search("welcome")}</h1>
            <h1>{props.value3.search("welcome")}</h1>
        </host>
    ),
    {
        props: {
            value1: String,
            value2: {
                type: String
            },
            value3: {
                type: String,
                value: (): "1" | "2" | "3" => "1"
            }
        }
    }
);

<MyComponent value1={"ok"}>...</MyComponent>;

customElements.define("my-element", MyComponent);
