import { container } from "../../util";
import { h, render, useEffect, useRef } from "../../../dist/atomico";

describe("test useEffect", () => {
    /**
     * verify that useEffect is executed after the manipulation of the DOM
     * for if to achieve the reference
     */
    test("execution after rendering", done => {
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
    test("execution before rendering", done => {
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
        render(null, scope); // remove
    });
    return;
    test("single execution", () => {
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
        render(<Test id="1" />, scope); // created
        render(<Test id="2" />, scope); // updated
        render(<Test id="3" />, scope); // updated
        render(null, scope); // remove

        expect(countUseEffect).toBe(1);

        expect(countUseEffectRemove).toBe(1);
    });
});
