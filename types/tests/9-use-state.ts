import { useState } from "core";

const [state, setState] = useState(0);

setState(() => state + 1);

const [state2, setState2] = useState((): number => 1);

setState2((value) => value + state2);
