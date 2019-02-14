import { h, render, useState, useEffect, useRef } from "../src/index";
import { container } from "./util";

describe("test with useEffect", () => {
    /**
     * verify that useEffect is executed after the manipulation of the DOM
     * for if to achieve the reference
     */
    it("basic", done => {
        let scope = container();
        function Test() {
            let ref = useRef();
            useEffect(() => {
                assert.equal(ref.current.nodeName, "H1");
                done();
            });
            return <h1 ref={ref}>hello</h1>;
        }
        render(<Test />, scope);
    });
    it("basic", done => {
        let scope = container();
        function Test() {
            let ref = useRef();
            useEffect(() => {
                return () => {
                    assert.equal(ref.current.nodeName, "H1");
                    done();
                };
            });
            return <h1 ref={ref}>hello</h1>;
        }
        render(<Test />, scope); // created
        render("", scope); // remove
    });
    it("once", () => {
        let scope = container(),
            countUseEffect = 0,
            countUseEffectRemove = 0;
        function Test() {
            let ref = useRef();
            useEffect(() => {
                countUseEffect++;
                return () => {
                    countUseEffectRemove++;
                };
            }, []);
            return <h1 ref={ref}>hello</h1>;
        }
        render(<Test />, scope); // created
        render(<Test />, scope); // updated
        render(<Test />, scope); // updated
        render("", scope); // remove

        assert.equal(countUseEffect, 1);
        assert.equal(countUseEffectRemove, 1);
    });
});
