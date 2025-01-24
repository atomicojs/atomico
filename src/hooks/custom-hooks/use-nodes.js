import { Mark } from "../../render.js";
import { useHost } from "../create-hooks.js";
import { useLayoutEffect, useState } from "../hooks.js";

/***
 * @type {import("hooks").UseNodes}
 */
export const useNodes = (filter) => {
    const host = useHost();
    const [nodes, setNodes] = useState([]);

    useLayoutEffect(() => {
        const { current } = host;

        if (!current.shadowRoot) return;

        const updateNodes = () => {
            setNodes(
                [...current.childNodes].filter((node) =>
                    filter ? filter(node) : true
                )
            );
        };
        /**
         * @type {MutationObserverInit}
         */
        const config = {
            childList: true
        };

        const mutation = new MutationObserver((entries) => {
            entries.forEach(({ addedNodes, removedNodes }) => {
                addedNodes.forEach(map);
                if (addedNodes.length || removedNodes.length) updateNodes();
            });
        });

        /**
         * @param {Node} child
         */
        const map = (child) => {
            if (child instanceof Mark) return;
            if (child instanceof Text) {
                mutation.observe(child, { ...config, characterData: true });
            }
        };

        mutation.observe(current, config);

        current.childNodes.forEach(map);

        updateNodes();

        return () => mutation.disconnect();
    }, []);

    return nodes;
};
