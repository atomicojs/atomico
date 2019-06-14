import htm from "htm";
import { createElement } from "./core";
export const html = htm.bind(createElement);
export default html;
