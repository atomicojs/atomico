import { useProp } from "core";

let [value, setValue] = useProp<number>("value");

value++;

setValue((prevValue) => prevValue + value);

setValue(null);

let [valueCallback, setValueCallback] =
    useProp<(value: number) => number>("value");

valueCallback(10);

setValueCallback((param) => param + 1);

const [expanded, setExpanded] = useProp<boolean>("expanded");

setExpanded((prevExpanded) => !prevExpanded);

setExpanded(!expanded);

setExpanded(null);

setExpanded(true);
