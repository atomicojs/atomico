# Example: Other Hooks (useId, useHost, useUpdate)

An example combining utility hooks like `useId` (for accessibility), `useHost` (for DOM manipulation), and `useUpdate`.

```tsx
import { c, css, useId, useHost, useUpdate, useEffect } from "atomico";

export const Tooltip = c(
    () => {
        // 1. useId: Generates a unique ID safe for accessibility attributes
        const tooltipId = useId();
        
        // 2. useHost: Returns a reference to the Custom Element (<host>) instance
        const host = useHost();
        
        // 3. useUpdate: Returns a function to manually trigger a re-render
        const update = useUpdate();

        useEffect(() => {
            // Using useHost to listen to native DOM events directly on the element
            const el = host.current;
            const onResize = () => {
                console.log("Resized!");
                update(); // Manually update component
            };
            
            window.addEventListener("resize", onResize);
            return () => window.removeEventListener("resize", onResize);
        }, []);

        return (
            <host shadowDom>
                {/* Using the unique ID for aria properties */}
                <button aria-describedby={tooltipId}>
                    Hover me
                </button>
                <div id={tooltipId} role="tooltip">
                    Current width: {host.current?.clientWidth || 0}px
                </div>
            </host>
        );
    },
    {
        styles: css`
            :host { display: inline-block; position: relative; }
            [role="tooltip"] {
                display: none;
                position: absolute;
                top: 100%;
                background: black;
                color: white;
            }
            button:hover + [role="tooltip"] {
                display: block;
            }
        `
    }
);

customElements.define("ui-tooltip", Tooltip);
```
