import { c, Host, useHost } from "core";

export const MyComponent = c(
    ({ message }): Host<{ onRender: Event }> => {
        const { current: host } = useHost<typeof MyComponent>();
        return (
            <host>
                <button
                    onclick={() => {
                        host.count++;
                    }}
                >
                    Increment
                </button>
                {message}: {host.count}
            </host>
        );
    },
    {
        props: {
            message: {
                type: String,
                reflect: true,
                value: "100" as "100" | "200"
            },
            count: {
                type: Number,
                value: 0
            }
        }
    }
);

const instanceMyComponent = new MyComponent();

instanceMyComponent.addEventListener("click", () => {});

<MyComponent
    onRender={({ currentTarget }) => {
        currentTarget.message === "100";
    }}
/>;
