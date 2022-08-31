import { useState } from "core";

// NUMBER
const [state, setState] = useState(0);

setState(() => state + 1);

const [state2, setState2] = useState((): number => 1);

setState2((value) => value + state2);

// BOOLEAN

const [state3, setState3] = useState<boolean>();

setState3(!state3);

setState3((prevState) => !prevState);

const [values, setValues] = useState<
    | [number, number, number, number]
    | [number, number, number, number, number, number]
>([1, 2, 3, 4]);

setValues([...values]);

// BOOLEAN

const [state4, setState4] = useState(true);

setState4(!state4);
