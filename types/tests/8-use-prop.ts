import { useProp } from "core";

// NUMBER
let [value, setValue] = useProp<number>("value");

if (typeof value === "number") {
    value++;
}

setValue((prevValue) => (prevValue || 0) + (value || 0));

setValue(null);

// CALLBACK

const [valueCallback, setValueCallback] =
    useProp<(value: number) => number>("value");

valueCallback && valueCallback(10);

setValueCallback((param) => param + 1);

setValueCallback(null);
setValueCallback(undefined);
// BOOLEAN

const [expanded, setExpanded] = useProp<boolean>("expanded");

setExpanded((prevExpanded) => !prevExpanded);

setExpanded(!expanded);

setExpanded(null);
setExpanded(undefined);

setExpanded(true);

// DATE

const [date, setDate] = useProp<Date>("date");

const newDate = new Date();

setDate(newDate);

date && date.getDate();

setDate(undefined);
setDate(null);

// ELEMENT

const [element, setElement] = useProp<Element>("date");

const el = document.createElement("div");

element && el.appendChild(element);

setElement(el);

// ELEMENT

const [obj, setObj] = useProp<{ id: number }>("date");

setObj({
    id: obj?.id || 0,
});

// HANDLER

const [, setValueFromHandler] = useProp<string>("value");

const handleChange = (event: Event) => {
    setValueFromHandler(
        (event.currentTarget as HTMLElement).getAttribute("value")
    );
};

handleChange(new Event("OK"));

// Default value
setValueFromHandler((value = "example") => value);

const [nn, setNN] = useProp("ok");

setNN(nn);
