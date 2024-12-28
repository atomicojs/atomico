import { c } from "atomico";

const MyElement = c(() => ({}), {
    props: {
        message: { type: String, value: () => "welcome" }
    }
});

export const MyComponent = c(
    (props) => {
        props.valueArray.length;
        props.valueElement?.message;
        props.valueArray.toString();
        props.valuePromiseWithConfig.then(() => {});
        return (
            <host shadowDom>
                <h1>{props.valueArray}</h1>
            </host>
        );
    },
    {
        props: {
            valueArray: {
                type: Array,
                value: () => []
            },
            valueElement: {
                type: MyElement,
                value: () => new MyElement()
            },
            valuePromiseWithConfig: {
                type: Promise,
                value: async (): Promise<number[]> => []
            },
            valuePromise: Promise,
            valueNumber: {
                type: Number,
                value: () => 1
            }
        }
    }
);

<MyComponent valuePromiseWithConfig={Promise.resolve([1, 2])} />;
