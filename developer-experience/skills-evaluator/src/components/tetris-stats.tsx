import { c, css } from "atomico";

export interface NextPieceInfo {
    matrix: number[][];
    color: string;
}

export const TetrisStats = c((props) => {
    const nextPiece = props.nextPiece;
    
    // Generate a 4x4 grid for the preview
    const previewSize = 4;
    const previewCells = [];
    
    for (let r = 0; r < previewSize; r++) {
        for (let c = 0; c < previewSize; c++) {
            let filled = false;
            let color = "";
            
            if (nextPiece && nextPiece.matrix) {
                const matrix = nextPiece.matrix;
                const rows = matrix.length;
                const cols = matrix[0]?.length || 0;
                
                // Centering offset
                const rOffset = Math.floor((previewSize - rows) / 2);
                const cOffset = Math.floor((previewSize - cols) / 2);
                
                const pr = r - rOffset;
                const pc = c - cOffset;
                
                if (pr >= 0 && pr < rows && pc >= 0 && pc < cols) {
                    if (matrix[pr][pc] !== 0) {
                        filled = true;
                        color = nextPiece.color;
                    }
                }
            }
            
            previewCells.push({ r, c, filled, color });
        }
    }

    return (
        <host shadowDom>
            <div class="stats-panel">
                <div class="stat-group">
                    <div class="stat-label">SCORE</div>
                    <div class="stat-value">{props.score}</div>
                </div>
                <div class="stat-group">
                    <div class="stat-label">LEVEL</div>
                    <div class="stat-value">{props.level}</div>
                </div>
                <div class="stat-group">
                    <div class="stat-label">LINES</div>
                    <div class="stat-value">{props.lines}</div>
                </div>
                <div class="preview-group">
                    <div class="stat-label">NEXT</div>
                    <div class="preview-box">
                        <div class="preview-grid">
                            {previewCells.map(cell => (
                                <div 
                                    class={`preview-cell ${cell.filled ? "filled" : "empty"}`} 
                                    style={cell.color ? `--cell-color: ${cell.color}` : ""}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </host>
    );
}, {
    props: {
        score: { type: Number, value: () => 0 },
        level: { type: Number, value: () => 1 },
        lines: { type: Number, value: () => 0 },
        nextPiece: { type: Object, value: (): NextPieceInfo | null => null }
    },
    styles: css`
        :host {
            display: block;
            font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', Courier, monospace;
            background: var(--tetris-bg, #000000);
            color: var(--tetris-text, #ffffff);
            padding: 20px;
            border: 1px solid var(--tetris-border, #ffffff);
            border-radius: 4px;
            min-width: 140px;
            box-sizing: border-box;
        }
        
        .stats-panel {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .stat-group {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        
        .stat-label {
            font-size: 0.75rem;
            letter-spacing: 0.15em;
            color: var(--tetris-label-color, rgba(255, 255, 255, 0.5));
        }
        
        .stat-value {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--tetris-neon-cyan, #00e5ff);
            text-shadow: 0 0 8px rgba(0, 229, 255, 0.3);
        }
        
        .preview-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .preview-box {
            border: 1px solid var(--tetris-border, #ffffff);
            padding: 10px;
            background: rgba(255, 255, 255, 0.02);
            display: flex;
            justify-content: center;
            align-items: center;
            aspect-ratio: 1;
            border-radius: 2px;
        }
        
        .preview-grid {
            display: grid;
            grid-template-columns: repeat(4, 18px);
            grid-template-rows: repeat(4, 18px);
            gap: 2px;
        }
        
        .preview-cell {
            border: 1px solid rgba(255, 255, 255, 0.03);
            box-sizing: border-box;
        }
        
        .preview-cell.filled {
            background-color: var(--cell-color, #ffffff);
            border: 1px solid #ffffff;
            box-shadow: 0 0 6px var(--cell-color, #ffffff);
        }
        
        .preview-cell.empty {
            background-color: transparent;
        }
    `
});
