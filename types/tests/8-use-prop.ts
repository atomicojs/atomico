import { useProp } from "core";

// NUMBER
let [value, setValue] = useProp<number>("value");

value++;

setValue((prevValue) => prevValue + value);

setValue(null);

// CALLBACK

const [valueCallback, setValueCallback] =
    useProp<(value: number) => number>("value");

valueCallback(10);

setValueCallback((param) => param + 1);

// BOOLEAN

const [expanded, setExpanded] = useProp<boolean>("expanded");

setExpanded((prevExpanded) => !prevExpanded);

setExpanded(!expanded);

setExpanded(null);

setExpanded(true);

// DATE

const [date, setDate] = useProp<Date>("date");

const newDate = new Date();

setDate(newDate);

date.getDate();

setDate(undefined);

// ELEMENT

const [element, setElement] = useProp<Element>("date");

const el = document.createElement("div");

el.appendChild(element);

setElement(el);

// ELEMENT

const [obj, setObj] = useProp<{ id: number }>("date");

setObj({
    id: obj.id,
});
