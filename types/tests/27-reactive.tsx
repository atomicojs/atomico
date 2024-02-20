import { useHost, c } from "core";

export function myComponent() {
    const { current } = useHost<typeof MyComponent>();
    return (
        <host>
            <button
                onclick={() => {
                    current.count++;
                    current.message?.toLocaleLowerCase();
                }}
            >
                increment
            </button>
        </host>
    );
}

myComponent.props = {
    count: { type: Number, value: 0 },
    message: { type: String }
};

export const MyComponent = c(myComponent);

const d = new MyComponent();

// Since it does not have a default value, it is assumed possibly undefined
d.count++;
// Since it does not have a default value, it is assumed possibly undefined
d.message?.toString();
