import { useState } from "core";

// NUMBER
const state = useState(0);
state.value = 1;

// BOOLEAN
const state2 = useState<boolean>();
state2.value = !state2.value;
