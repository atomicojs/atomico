import { c, css } from "atomico";

export interface ActivePieceInfo {
    matrix: number[][];
    x: number;
    y: number;
}

export const TetrisBoard = c((props) => {
    const grid = props.grid;
    const activePiece = props.activePiece;
    const activeColor = props.activeColor;
    const ghostY = props.ghostY;
    
    const rows = 20;
    const cols = 10;
    const cells = [];
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const lockedColor = grid[r]?.[c] || null;
            
            let cellType: "empty" | "locked" | "active" | "ghost" = "empty";
            let color = "";
            
            if (lockedColor) {
                cellType = "locked";
                color = lockedColor;
            } else {
                const isActive = activePiece &&
                    r >= activePiece.y &&
                    r < activePiece.y + activePiece.matrix.length &&
                    c >= activePiece.x &&
                    c < activePiece.x + activePiece.matrix[0].length &&
                    activePiece.matrix[r - activePiece.y][c - activePiece.x] !== 0;
                    
                if (isActive) {
                    cellType = "active";
                    color = activeColor;
                } else {
                    const isGhost = activePiece &&
                        r >= ghostY &&
                        r < ghostY + activePiece.matrix.length &&
                        c >= activePiece.x &&
                        c < activePiece.x + activePiece.matrix[0].length &&
                        activePiece.matrix[r - ghostY][c - activePiece.x] !== 0;
                        
                    if (isGhost) {
                        cellType = "ghost";
                        color = activeColor;
                    }
                }
            }
            
            cells.push({ r, c, cellType, color });
        }
    }

    return (
        <host shadowDom>
            <div class={`board-container ${props.flash ? "flash-effect" : ""}`}>
                <div class="grid">
                    {cells.map(cell => (
                        <div 
                            class={`cell ${cell.cellType}`} 
                            style={cell.color ? `--cell-color: ${cell.color}` : ""}
                        />
                    ))}
                </div>
                
                {props.gameOver && (
                    <div class="overlay game-over-overlay">
                        <div class="overlay-title pulsing">GAME OVER</div>
                        <div class="overlay-subtitle">PRESS ENTER TO RESTART</div>
                    </div>
                )}
                
                {props.paused && !props.gameOver && (
                    <div class="overlay pause-overlay">
                        <div class="overlay-title">PAUSED</div>
                        <div class="overlay-subtitle">PRESS ESC / P TO RESUME</div>
                    </div>
                )}
            </div>
        </host>
    );
}, {
    props: {
        grid: { type: Array, value: (): (string | null)[][] => Array(20).fill(null).map(() => Array(10).fill(null)) },
        activePiece: { type: Object, value: (): ActivePieceInfo | null => null },
        activeColor: { type: String, value: () => "#00e5ff" },
        ghostY: { type: Number, value: () => 0 },
        gameOver: { type: Boolean, value: () => false },
        paused: { type: Boolean, value: () => false },
        flash: { type: Boolean, value: () => false }
    },
    styles: css`
        :host {
            display: block;
            background: var(--tetris-bg, #000000);
            border: 1px solid var(--tetris-border, #ffffff);
            border-radius: 4px;
            overflow: hidden;
            position: relative;
            box-sizing: border-box;
        }
        
        .board-container {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(10, 30px);
            grid-template-rows: repeat(20, 30px);
            gap: 1px;
            background-color: var(--tetris-grid-color, rgba(255, 255, 255, 0.05));
            padding: 1px;
        }
        
        .cell {
            box-sizing: border-box;
            background-color: transparent;
            transition: background-color 0.05s ease, border-color 0.05s ease;
        }
        
        .cell.empty {
            background-color: var(--tetris-bg, #000000);
        }
        
        .cell.active {
            background-color: var(--cell-color, #00e5ff);
            border: 1px solid #ffffff;
            box-shadow: 0 0 8px var(--cell-color, #00e5ff);
        }
        
        .cell.ghost {
            border: 1px dashed rgba(255, 255, 255, 0.4);
            background-color: rgba(255, 255, 255, 0.03);
        }
        
        .cell.locked {
            background-color: var(--cell-color, #ffffff);
            border: 1px solid rgba(0, 0, 0, 0.15);
            box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.2);
        }
        
        .overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.85);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', Courier, monospace;
            color: #ffffff;
            z-index: 10;
        }
        
        .overlay-title {
            font-size: 2rem;
            font-weight: bold;
            letter-spacing: 0.1em;
            margin-bottom: 12px;
        }
        
        .game-over-overlay .overlay-title {
            color: var(--tetris-neon-red, #ff0055);
            text-shadow: 0 0 12px rgba(255, 0, 85, 0.5);
        }
        
        .pause-overlay .overlay-title {
            color: var(--tetris-neon-cyan, #00e5ff);
            text-shadow: 0 0 12px rgba(0, 229, 255, 0.5);
        }
        
        .overlay-subtitle {
            font-size: 0.85rem;
            letter-spacing: 0.05em;
            color: rgba(255, 255, 255, 0.6);
        }
        
        /* Animations */
        @keyframes pulse {
            0% { opacity: 0.6; transform: scale(0.98); }
            50% { opacity: 1; transform: scale(1.02); }
            100% { opacity: 0.6; transform: scale(0.98); }
        }
        
        .pulsing {
            animation: pulse 1.8s infinite ease-in-out;
        }
        
        @keyframes flash {
            0% { filter: brightness(2.5); }
            100% { filter: brightness(1); }
        }
        
        .flash-effect {
            animation: flash 0.15s ease-out;
        }
    `
});
