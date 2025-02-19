import { c, createContext, useContext, css } from "atomico";

const MyContext = createContext({ name: "Atomico" });

const MyComponent = c(
    () => {
        const { name } = useContext(MyContext);
        return (
            <host shadowDom>
                <strong>{name}</strong>
                <div>
                    <strong>Slot Dinamic!</strong>
                    <MyContext value={{ name: name + "-x2" }}>
                        <slot></slot>
                    </MyContext>
                </div>
                <div>
                    <strong>Slot Static</strong>
                    <MyContext value={{ name: "Static!" }}>
                        <slot name="static"></slot>
                    </MyContext>
                </div>
            </host>
        );
    },
    {
        styles: css`
            :host {
                display: grid;
            }
            div {
                padding: 0 1rem;
                border-left: 1px solid red;
                box-sizing: border-box;
            }
        `
    }
);

customElements.define("my-context", MyContext);
customElements.define("my-component", MyComponent);
