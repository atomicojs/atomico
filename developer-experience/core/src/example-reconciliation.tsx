import { c, useState, useRef, useLayoutEffect } from "atomico";

export const EgReconciliation = c(() => {
    const [show, setShow] = useState(true);
    
    // State to store the visual inspection of the DOM child nodes
    const [domNodes, setDomNodes] = useState<{ type: string; name: string; content: string }[]>([]);
    
    const containerRef = useRef<HTMLDivElement>();

    // Inspect the actual DOM child nodes after every render
    useLayoutEffect(() => {
        if (!containerRef.current) return;
        
        // Read the actual childNodes from the DOM container
        const list = Array.from(containerRef.current.childNodes).map((node) => {
            let type = "Unknown";
            if (node.nodeType === Node.TEXT_NODE) type = "Text Node";
            else if (node.nodeType === Node.ELEMENT_NODE) type = "Element Node";
            else if (node.nodeType === Node.COMMENT_NODE) type = "Comment Node";
            
            return {
                type,
                name: node.nodeName,
                content: node.textContent || ""
            };
        });
        
        setDomNodes(list);
    }, [show]);

    return (
        <host style="display: block; font-family: system-ui, sans-serif; max-width: 600px; padding: 25px; border-radius: 12px; border: 1px solid #e0e0e0; margin: 30px auto; background: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <h2 style="margin-top: 0; color: #1e1e1e; font-size: 20px; border-bottom: 2px solid #eaeaea; padding-bottom: 10px;">
                🧪 DOM Reconciliation Inspector
            </h2>
            
            <p style="color: #666; font-size: 14px; line-height: 1.5;">
                This example demonstrates how Atomico conciles and flattens adjacent strings and conditional elements in real-time. 
                Use the toggle button to trigger the conditional transitions.
            </p>

            {/* 1. Toggle Button */}
            <button
                style="margin-bottom: 20px; padding: 10px 16px; background: #0070f3; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 14px; transition: background 0.2s;"
                onclick={() => setShow(!show)}
            >
                Toggle Element: {show ? "ON" : "OFF (null)"}
            </button>

            {/* 2. Container under Test */}
            <div style="border: 2px dashed #0070f3; border-radius: 8px; padding: 15px; background: #f0f7ff; margin-bottom: 20px;">
                <div style="font-size: 12px; color: #0070f3; font-weight: bold; margin-bottom: 8px; text-transform: uppercase;">
                    Target DOM Container (Rendered Output):
                </div>
                
                {/* THIS IS THE TESTED ARRAY CONCILIATION */}
                <div ref={containerRef} style="font-size: 18px; font-weight: 500; display: flex; align-items: center; gap: 8px; min-height: 35px;">
                    {"1"}
                    {"2"}
                    {show}
                    {show && (
                        <span style="color: #ea4335; background: #fde8e8; border: 1px solid #f8b4b4; padding: 2px 8px; border-radius: 4px; font-size: 14px;">
                            Element
                        </span>
                    ) }
                    {!show && (
                        <span style="color: #ea4335; background: #fde8e8; border: 1px solid #f8b4b4; padding: 2px 8px; border-radius: 4px; font-size: 14px;">
                            Element
                        </span>
                    ) }
                    {"3"}
                </div>
            </div>

            {/* 3. Visual DOM Node Inspector */}
            <div style="background: #1e1e1e; color: #39ff14; font-family: monospace; padding: 15px; border-radius: 8px; font-size: 13px;">
                <div style="color: #aaa; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #444; padding-bottom: 5px;">
                    📁 DOM Node Tree Inspector ({domNodes.length} nodes):
                </div>
                {domNodes.map((node, index) => (
                    <div key={index} style="margin-bottom: 8px; display: flex; align-items: flex-start; line-height: 1.4;">
                        <span style="color: #00bfff; margin-right: 8px;">[{index}]</span>
                        <div>
                            <span style="color: #ff00ff; font-weight: bold;">{node.type}</span>
                            <span style="color: #888;"> ({node.name}):</span>
                            <span style="color: #ffffff; background: #333; padding: 1px 4px; border-radius: 3px; margin-left: 5px;">
                                "{node.content}"
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 4. Architectural Analysis */}
            <div style="margin-top: 20px; font-size: 13px; color: #555; background: #fcf8e3; border: 1px solid #faebcc; padding: 15px; border-radius: 8px;">
                💡 <strong>Current Reconciler Behavior:</strong>
                {show ? (
                    <div style="margin-top: 5px;">
                        The array is flattened to <code>["12", Element, "3"]</code>. 
                        DOM holds <strong>3 nodes</strong>: <code>TextNode("12")</code>, <code>ElementNode(SPAN)</code>, and <code>TextNode("3")</code>.
                    </div>
                ) : (
                    <div style="margin-top: 5px;">
                        Since <code>null</code> is discarded, all adjacent string nodes collapse together.
                        The array is flattened to <code>["123"]</code>.
                        DOM holds <strong>1 single node</strong>: <code>TextNode("123")</code>.
                    </div>
                )}
            </div>
        </host>
    );
});

customElements.define("example-reconciliation", EgReconciliation);
