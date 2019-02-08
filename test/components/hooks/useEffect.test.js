import { container } from "../../util";
import { h, render, useEffect, useRef } from "../../../dist/atomico";

describe("test with useEffect", () => {
    /**
     * verify that useEffect is executed after the manipulation of the DOM
     * for if to achieve the reference
     */
    test("basic", done => {
        let scope = container();
        function Test() {
            let ref = useRef();
            useEffect(() => {
                expect(ref.current.nodeName).toBe("H1");
                done();
            });
            return <h1 ref={ref}>hello</h1>;
        }
        render(<Test />, scope);
    });
    test("basic", done => {
        let scope = container();
        function Test() {
            let ref = useRef();
            useEffect(() => {
                return () => {
                    expect(ref.current.nodeName).toBe("H1");
                    done();
                };
            });
            return <h1 ref={ref}>hello</h1>;
        }
        render(<Test />, scope); // created
        render("", scope); // remove
    });
    test("once", () => {
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

        expect(countUseEffect).toBe(1);
        expect(countUseEffectRemove).toBe(1);
    });
});
