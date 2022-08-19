import { Host, c, html } from "core";

function component(): Host<{ setEvent(event: Event): void; onClick: Event }> {
    return html`<host></host>`;
}

const MyComponent = c(component);

const instance = new MyComponent();

let event = new Event("click");

instance.setEvent(event);

<MyComponent
    onClick={(event) => {
        event.currentTarget.setEvent(event);
    }}
></MyComponent>;
