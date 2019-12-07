import { h } from "../../core/core";
import { customElementScope } from "../../tests/utils";
import { useLazy, useLazyNode } from "../use-lazy";

describe("module : use-lazy", () => {
    it("useLazy", done => {
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

    it("useLazyNode", done => {
        function Complete() {
            return "ready!";
        }
        function WC() {
            let NodeAsync = useLazyNode(
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
