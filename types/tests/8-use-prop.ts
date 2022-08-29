import { useProp } from "core";

let [value, setValue] = useProp<number>("value");

value++;

setValue(() => value);

let [valueCallback, setValueCallback] =
    useProp<(value: number) => number>("value");

valueCallback(10);

setValueCallback((param) => param + 1);
