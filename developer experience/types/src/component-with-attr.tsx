import { c } from "atomico";

export const MyComponent = c(
    (props) => {
        return (
            <host shadowDom>
                <h1>{props.valueOne}</h1>
                <button>{props.valueTwo}</button>
            </host>
        );
    },
    {
        props: {
            valueOne: String,
            valueTwo: Number,
            startDate: Date,
            myFn: Function
        }
    }
);

<MyComponent start-date={"24-010-24"}>...</MyComponent>;

customElements.define("my-element", MyComponent);
