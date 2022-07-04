import { isServer } from "./ssr/utils.js";

if (isServer()) await import("./ssr/load.js");
