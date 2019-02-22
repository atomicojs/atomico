import { h, useMemo } from "../../../src/index";

import Dot from "./dot";
let targetSize = 25;

export default function Triangle({ s, y, x }) {
    if (s <= targetSize) {
        return (
            <Dot
                x={x - targetSize / 2}
                y={y - targetSize / 2}
                size={targetSize}
            />
        );
    }

    s = s / 2;
    return (
        <div>
            <Triangle x={x} y={y - s / 2} s={s} />
            <Triangle x={x - s} y={y + s / 2} s={s} />
            <Triangle x={x + s} y={y + s / 2} s={s} />
        </div>
    );
}
