import { h } from "../../core/core";
import { customElementScope } from "../../tests/utils";
import { useLazy } from "../use-lazy";

describe("use-lazy", () => {
    it("async", done => {
        function Complete() {
            return "ready!";
        }
        function WC() {
            let NodeAsync = useLazy(
                () =>
                    new Promise(resolve =>
                        setTimeout(() => {
                            resolve(Complete);
                            done();
                        }, 1000)
                    )
            );

            return <NodeAsync loading="...." />;
        }

        let node = customElementScope(WC);

        document.body.appendChild(node);
    });
});
