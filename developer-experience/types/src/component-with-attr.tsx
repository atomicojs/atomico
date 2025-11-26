import { c } from "atomico";

export const MyComponent = c(
    (props) => {
        return (
            <host shadowDom>
                <h1>{props.valueOne}</h1>
                <button>{props.valueTwo}</button>
                {props.valueDate.toLocaleString()}
                {props.valueMap.size}
            </host>
        );
    },
    {
        props: {
            valueOne: String,
            valueTwo: Number,
            valueDate: {
                type: Date,
                value: () => new Date()
            },
            valueMap: {
                type: Map,
                value: () => new Map([[1, 1]])
            }
        }
    }
);

<MyComponent start-date={"24-010-24"}>...</MyComponent>;

customElements.define("my-element", MyComponent);
