import { Atomico } from "./dom.js";
import {
    EventFunction,
    InferProps,
    SchemaComponentStylesConfig,
    SchemaComponentConfig,
    ShemaConfigEvent
} from "./schema.js";

export interface EmptyProps {
    props: {};
}

export function event<Detail, Config = ShemaConfigEvent<Detail>>(
    config: Config
): EventFunction<Detail>;

export interface View<Config extends SchemaComponentConfig> {
    (props: InferProps<Config["props"]>): any;
}

export type DefineConfig<Config> = Config extends SchemaComponentConfig
    ? Config
    : Config extends SchemaComponentStylesConfig
    ? Config & EmptyProps
    : EmptyProps;

export function c<
    Config extends SchemaComponentConfig | SchemaComponentStylesConfig
>(
    view: View<DefineConfig<Config>>,
    config?: Config
): Atomico<DefineConfig<Config>>;
