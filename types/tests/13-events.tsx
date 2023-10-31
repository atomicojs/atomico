import { c, DOMEvent, Host } from "core";
import { DOMListener } from "dom";

// Event from Types

const handler: DOMListener<HTMLInputElement> = (event) => {
    event.currentTarget.value;
};

<input type="text" oninput={handler} />;

// Event from host

function component(): Host<{ onChange: Event }> {
    return <host></host>;
}

component.props = { value: String };

const Component = c(component);

const handlerFromDomListener: DOMListener<typeof Component> = (event) => {
    event.currentTarget.value;
};

handlerFromDomListener.once = true;

<Component onChange={handlerFromDomListener}></Component>;

// DOMEvent

const handlerDomEvent = (
    event: DOMEvent<typeof Component, CustomEvent<{ id: number }>>,
) => {
    event.currentTarget.value;
    event.detail.id;
};

<Component onChange={handlerDomEvent}></Component>;

// DOMEvent for input

const handlerDomEventForInput = (
    event: DOMEvent<HTMLInputElement, CustomEvent<{ id: number }>>,
) => {
    event.currentTarget.value;
    event.detail.id;
};

<input type="text" onchange={handlerDomEventForInput} />;
