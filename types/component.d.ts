import {
    EventFunction,
    InferProps,
    SchemaComponentConfig,
    ShemaConfigEvent
} from "./schema-component.js";
import { Atomico } from "./dom.js";

export function event<Detail, Config = ShemaConfigEvent<Detail>>(
    config: Config
): EventFunction<Detail>;

export interface View<Config extends SchemaComponentConfig> {
    (props: InferProps<Config["props"]>): any;
}

export function c<Config extends SchemaComponentConfig>(
    view: View<Config>,
    config?: Config
): Atomico<Config>;
