import { useState } from "core";

// NUMBER
const state = useState(0);

state.value++;

// BOOLEAN

const state2 = useState<boolean>();

state2.value = !state2.value;
