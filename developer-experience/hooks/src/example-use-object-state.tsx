/**
 * The next example demonstrates the useObjectState hook in Atomico.
 * useObjectState provides a simple way to manage object state with
 * automatic shallow merging and render prevention when values are identical.
 */
import { c, useObjectState, useRef, useEffect } from "atomico";

export const EgUseObjectState = c(() => {
    // 1. Declare state as a typed object
    const [state, setState] = useObjectState({
        name: "Antigravity",
        role: "AI Agent",
        clicks: 0
    });

    // Keep track of renders to visually demonstrate the rendering optimization!
    const renderCountRef = useRef(0);
    renderCountRef.current++;


    // Effect to demonstrate when state actually changes
    useEffect(() => {
        console.log("State updated in component:", state);
    }, [state]);

    return (
        <host style="display: block; font-family: sans-serif; max-width: 400px; padding: 20px; border: 1px solid #ccc; border-radius: 8px; margin: 20px;">
            <h3>Atomico: <code>useObjectState</code> Example</h3>
            
            <div style="background: #f4f4f4; padding: 10px; border-radius: 4px; margin-bottom: 15px;">
                <strong>Current State:</strong>
                <pre style="margin: 5px 0 0 0; font-size: 13px;">
                    {JSON.stringify(state, null, 2)}
                </pre>
            </div>

            <div style="margin-bottom: 15px; color: #666; font-size: 14px;">
                🔄 <strong>Render Count:</strong> {renderCountRef.current}
            </div>

            <div style="display: flex; flex-direction: column; gap: 8px;">
                {/* 1. Partial Update changing a value */}
                <button
                    style="padding: 8px; cursor: pointer; background: #0070f3; color: white; border: none; border-radius: 4px;"
                    onclick={() => {
                        setState((prev) => ({ clicks: prev.clicks + 1 }));
                    }}
                >
                    Increment clicks (Changes state)
                </button>

                {/* 2. Partial Update with IDENTICAL value (Demonstrates Render Prevention) */}
                <button
                    style="padding: 8px; cursor: pointer; background: #ea4335; color: white; border: none; border-radius: 4px;"
                    onclick={() => {
                        console.log("Despachando { name: 'Antigravity' } (No cambia valor)");
                        setState({ name: "Antigravity" });
                    }}
                >
                    Set name to 'Antigravity' (No change, no render!)
                </button>

                {/* 3. Partial Update changing name */}
                <button
                    style="padding: 8px; cursor: pointer; background: #34a853; color: white; border: none; border-radius: 4px;"
                    onclick={() => {
                        setState({ name: "Atomico" });
                    }}
                >
                    Change name to 'Atomico' (Changes value)
                </button>
            </div>
            
            <p style="font-size: 12px; color: #888; margin-top: 15px; text-align: center;">
                Check the console to observe rendering logs.
            </p>
        </host>
    );
});

customElements.define("example-use-object-state", EgUseObjectState);
