import { PropError } from "core";

const error = new PropError(document.createElement("div"), "a", "a");

error.target.addEventListener("ok", console.log);

error.message.concat("");

JSON.parse(error.value);
