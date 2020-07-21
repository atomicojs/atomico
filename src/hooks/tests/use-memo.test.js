import { expect } from "@bundled-es-modules/chai";
import { createHooks } from "../create-hooks";
import { useMemo } from "../hooks";

it("useMemo execution between updates without memorizing arguments", () => {
    let render = () => {};
    let hooks = createHooks(render, null);
    let cycles = 0;
    let cyclesEffect = 0;
    let load = () => {
        cycles++;
        useMemo(() => {
            cyclesEffect++;
        });
    };

    let update = () => {
        hooks.load(load, null);
        hooks.updated();
    };

    update();
    update();
    update();

    expect(cycles).to.equal(cyclesEffect);
});

it("useMemo execution between updates without memorizing arguments", () => {
    let render = () => {};
    let hooks = createHooks(render, null);
    let cycles = 0;
    let values = {};
    let load = (value) => {
        values[cycles++] = useMemo(() => value, [value]);
    };

    let update = (value) => {
        hooks.load(load, value);
        hooks.updated();
    };

    update(0); // values[0] = 0
    update(0); // values[1] = 0
    update(0); // values[2] = 0

    let ref = {};

    update(ref); // values[0] = ref
    update(ref); // values[2] = ref

    expect(values[0]).to.equal(0);
    expect(values[1]).to.equal(0);
    expect(values[2]).to.equal(0);

    expect(values[3]).to.equal(ref);
    expect(values[4]).to.equal(ref);
});
