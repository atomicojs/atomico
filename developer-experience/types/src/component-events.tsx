import { c, event, callback } from "atomico";

export const MyComponent = c(
    (props) => {
        if (props.processMarkdown) {
            props.processMarkdown();
        }
        return <host>{props.message}</host>;
    },
    {
        props: {
            message: String,
            change: event<{ id: number }>(),
            create: event(),
            destroy: event<{ id: number }>(),
            /**
             * `callback` allows you to create a function that will be received as a component property and is expected to return a value.
             * This serves as an alternative to using events, enabling you to delegate logic to the parent component while allowing the child component to process that logic.
             */
            processMarkdown: callback<() => Promise<string>>()
        }
    }
);

const node = new MyComponent();

node.change({ id: 10 });

/**
 *
 */
node.processMarkdown?.();

<MyComponent
    ondestroy={({ detail }) => {
        console.log(detail.id * 2);
    }}
/>;
