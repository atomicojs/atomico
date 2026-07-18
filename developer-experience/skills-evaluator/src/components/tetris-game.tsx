import { c, css, useObjectState, useEffect, useRef, useHost, useListener, event } from "atomico";
import { TetrisBoard } from "./tetris-board.js";
import { TetrisStats } from "./tetris-stats.js";

const SHAPES = {
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    O: [
        [1, 1],
        [1, 1]
    ],
    T: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    J: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    L: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ]
};

const SHAPE_COLORS: Record<keyof typeof SHAPES, string> = {
    I: "var(--tetris-neon-cyan, #00e5ff)",
    O: "var(--tetris-neon-yellow, #ffff00)",
    T: "var(--tetris-neon-purple, #a000ff)",
    S: "var(--tetris-neon-green, #00ff66)",
    Z: "var(--tetris-neon-red, #ff0055)",
    J: "var(--tetris-neon-blue, #0066ff)",
    L: "var(--tetris-neon-orange, #ff9900)"
};

const generateBag = (): (keyof typeof SHAPES)[] => {
    const bag: (keyof typeof SHAPES)[] = ["I", "O", "T", "S", "Z", "J", "L"];
    for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = bag[i];
        bag[i] = bag[j];
        bag[j] = temp;
    }
    return bag;
};

const rotateMatrix = (matrix: number[][]): number[][] => {
    const n = matrix.length;
    const result = Array(n).fill(null).map(() => Array(n).fill(0));
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            result[c][n - 1 - r] = matrix[r][c];
        }
    }
    return result;
};

const checkCollision = (
    matrix: number[][],
    grid: (string | null)[][],
    px: number,
    py: number
): boolean => {
    for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
            if (matrix[r][c] !== 0) {
                const targetX = px + c;
                const targetY = py + r;
                
                if (targetX < 0 || targetX >= 10) {
                    return true;
                }
                
                if (targetY >= 20) {
                    return true;
                }
                
                if (targetY >= 0) {
                    if (grid[targetY][targetX] !== null) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
};

const getGhostY = (
    matrix: number[][],
    grid: (string | null)[][],
    px: number,
    py: number
): number => {
    let gy = py;
    while (!checkCollision(matrix, grid, px, gy + 1)) {
        gy++;
    }
    return gy;
};

const createEmptyGrid = (): (string | null)[][] => 
    Array(20).fill(null).map(() => Array(10).fill(null));

interface GameState {
    grid: (string | null)[][];
    bag: (keyof typeof SHAPES)[];
    activePiece: {
        type: keyof typeof SHAPES;
        matrix: number[][];
        x: number;
        y: number;
        color: string;
    } | null;
    nextPiece: {
        type: keyof typeof SHAPES;
        matrix: number[][];
        color: string;
    } | null;
    score: number;
    level: number;
    lines: number;
    gameOver: boolean;
    paused: boolean;
    flash: boolean;
}

const getInitialState = (): GameState => {
    const bag = generateBag();
    const nextType = bag.pop()!;
    const activeType = bag.pop()!;
    return {
        grid: createEmptyGrid(),
        bag,
        activePiece: {
            type: activeType,
            matrix: SHAPES[activeType],
            x: Math.floor((10 - SHAPES[activeType][0].length) / 2),
            y: activeType === "I" ? -1 : 0,
            color: SHAPE_COLORS[activeType]
        },
        nextPiece: {
            type: nextType,
            matrix: SHAPES[nextType],
            color: SHAPE_COLORS[nextType]
        },
        score: 0,
        level: 1,
        lines: 0,
        gameOver: false,
        paused: false,
        flash: false
    };
};

const getTickSpeed = (level: number): number => {
    return Math.max(100, 1000 - (level - 1) * 80);
};

export const TetrisGame = c((props) => {
    const [state, setState] = useObjectState<GameState>(getInitialState());
    
    const stateRef = useRef<GameState>();
    stateRef.current = state;
    
    const hostRef = useHost<HTMLElement>();
    
    const lockPiece = (currentState: GameState, forceFlash: boolean = false) => {
        const { activePiece, grid, bag, nextPiece, score, level, lines } = currentState;
        if (!activePiece || !nextPiece) return;
        
        const newGrid = grid.map(row => [...row]);
        const matrix = activePiece.matrix;
        let outOfBoundsLock = false;
        
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c] !== 0) {
                    const targetY = activePiece.y + r;
                    const targetX = activePiece.x + c;
                    if (targetY >= 0 && targetY < 20 && targetX >= 0 && targetX < 10) {
                        newGrid[targetY][targetX] = activePiece.color;
                    } else if (targetY < 0) {
                        outOfBoundsLock = true;
                    }
                }
            }
        }
        
        let clearedLinesCount = 0;
        const filteredGrid = newGrid.filter(row => {
            const isFull = row.every(cell => cell !== null);
            if (isFull) clearedLinesCount++;
            return !isFull;
        });
        
        while (filteredGrid.length < 20) {
            filteredGrid.unshift(Array(10).fill(null));
        }
        
        const newLines = lines + clearedLinesCount;
        const newLevel = Math.floor(newLines / 10) + 1;
        
        let scoreGain = 0;
        if (clearedLinesCount === 1) scoreGain = 100 * level;
        else if (clearedLinesCount === 2) scoreGain = 300 * level;
        else if (clearedLinesCount === 3) scoreGain = 500 * level;
        else if (clearedLinesCount === 4) scoreGain = 800 * level;
        
        const newScore = score + scoreGain;
        let newGameOver = outOfBoundsLock;
        
        const nextActiveType = nextPiece.type;
        const newActivePiece = {
            type: nextActiveType,
            matrix: SHAPES[nextActiveType],
            x: Math.floor((10 - SHAPES[nextActiveType][0].length) / 2),
            y: nextActiveType === "I" ? -1 : 0,
            color: SHAPE_COLORS[nextActiveType]
        };
        
        if (checkCollision(newActivePiece.matrix, filteredGrid, newActivePiece.x, newActivePiece.y)) {
            newGameOver = true;
        }
        
        const newBag = [...bag];
        if (newBag.length < 2) {
            newBag.unshift(...generateBag());
        }
        const nextType = newBag.pop()!;
        const newNextPiece = {
            type: nextType,
            matrix: SHAPES[nextType],
            color: SHAPE_COLORS[nextType]
        };
        
        const hasCleared = clearedLinesCount > 0;
        const shouldFlash = hasCleared || forceFlash;
        
        setState({
            grid: filteredGrid,
            bag: newBag,
            activePiece: newGameOver ? null : newActivePiece,
            nextPiece: newGameOver ? null : newNextPiece,
            score: newScore,
            level: newLevel,
            lines: newLines,
            gameOver: newGameOver,
            flash: shouldFlash
        });
        
        if (shouldFlash) {
            setTimeout(() => {
                setState({ flash: false });
            }, 150);
        }
        
        if (newGameOver) {
            props.gameover();
        } else {
            if (hasCleared) {
                props.linescleared(clearedLinesCount);
            }
            props.scoreupdate({ score: newScore, level: newLevel, lines: newLines });
        }
    };
    
    const tick = () => {
        const currentState = stateRef.current;
        if (!currentState || currentState.gameOver || currentState.paused) return;
        
        const { activePiece, grid } = currentState;
        if (!activePiece) return;
        
        if (!checkCollision(activePiece.matrix, grid, activePiece.x, activePiece.y + 1)) {
            setState({
                activePiece: {
                    ...activePiece,
                    y: activePiece.y + 1
                }
            });
        } else {
            lockPiece(currentState);
        }
    };
    
    const tickRef = useRef<() => void>();
    tickRef.current = tick;
    
    useEffect(() => {
        if (state.gameOver || state.paused) return;
        
        const interval = setInterval(() => {
            tickRef.current?.();
        }, getTickSpeed(state.level));
        
        return () => clearInterval(interval);
    }, [state.gameOver, state.paused, state.level]);
    
    useEffect(() => {
        hostRef.current?.focus();
    }, []);
    
    const handleKeyDown = (e: KeyboardEvent) => {
        const currentState = stateRef.current;
        if (!currentState) return;
        
        const { gameOver, paused, activePiece, grid } = currentState;
        
        if (e.key === "Enter") {
            if (gameOver) {
                const s = getInitialState();
                setState(s);
                props.scoreupdate({ score: s.score, level: s.level, lines: s.lines });
                e.preventDefault();
            }
            return;
        }
        
        if (e.key === "Escape" || e.key.toLowerCase() === "p") {
            if (!gameOver) {
                setState({ paused: !paused });
                e.preventDefault();
            }
            return;
        }
        
        if (gameOver || paused || !activePiece) return;
        
        switch (e.key) {
            case "ArrowLeft": {
                if (!checkCollision(activePiece.matrix, grid, activePiece.x - 1, activePiece.y)) {
                    setState({
                        activePiece: {
                            ...activePiece,
                            x: activePiece.x - 1
                        }
                    });
                }
                e.preventDefault();
                break;
            }
            case "ArrowRight": {
                if (!checkCollision(activePiece.matrix, grid, activePiece.x + 1, activePiece.y)) {
                    setState({
                        activePiece: {
                            ...activePiece,
                            x: activePiece.x + 1
                        }
                    });
                }
                e.preventDefault();
                break;
            }
            case "ArrowDown": {
                if (!checkCollision(activePiece.matrix, grid, activePiece.x, activePiece.y + 1)) {
                    setState({
                        activePiece: {
                            ...activePiece,
                            y: activePiece.y + 1
                        }
                    });
                }
                e.preventDefault();
                break;
            }
            case "ArrowUp": {
                const rotated = rotateMatrix(activePiece.matrix);
                const kicks = [0, -1, 1, -2, 2];
                let rotatedOk = false;
                
                for (const kick of kicks) {
                    if (!checkCollision(rotated, grid, activePiece.x + kick, activePiece.y)) {
                        setState({
                            activePiece: {
                                ...activePiece,
                                matrix: rotated,
                                x: activePiece.x + kick
                            }
                        });
                        rotatedOk = true;
                        break;
                    }
                }
                
                if (!rotatedOk) {
                    if (!checkCollision(rotated, grid, activePiece.x, activePiece.y - 1)) {
                        setState({
                            activePiece: {
                                ...activePiece,
                                matrix: rotated,
                                y: activePiece.y - 1
                            }
                        });
                    }
                }
                
                e.preventDefault();
                break;
            }
            case " ": {
                const gy = getGhostY(activePiece.matrix, grid, activePiece.x, activePiece.y);
                const hardDroppedPiece = {
                    ...activePiece,
                    y: gy
                };
                
                lockPiece({
                    ...currentState,
                    activePiece: hardDroppedPiece
                }, true);
                
                e.preventDefault();
                break;
            }
        }
    };
    
    useListener(hostRef, "keydown", handleKeyDown);
    
    const ghostY = state.activePiece
        ? getGhostY(state.activePiece.matrix, state.grid, state.activePiece.x, state.activePiece.y)
        : 0;
        
    return (
        <host shadowDom tabIndex={0} onclick={() => hostRef.current?.focus()}>
            <div class="game-container">
                <header class="game-header">
                    <h1>NEO-TETRIS</h1>
                    <p class="subtitle">MINIMALIST HIGH-CONTRAST SENSORY GRID</p>
                </header>
                
                <div class="game-layout">
                    <TetrisBoard 
                        grid={state.grid} 
                        activePiece={state.activePiece}
                        activeColor={state.activePiece ? state.activePiece.color : "#00e5ff"}
                        ghostY={ghostY}
                        gameOver={state.gameOver}
                        paused={state.paused}
                        flash={state.flash}
                    />
                    <TetrisStats 
                        score={state.score} 
                        level={state.level} 
                        lines={state.lines} 
                        nextPiece={state.nextPiece}
                    />
                </div>
                
                <footer class="game-footer">
                    <div class="controls-guide">
                        <div><span class="key">←</span> <span class="key">→</span> MOVE</div>
                        <div><span class="key">↑</span> ROTATE</div>
                        <div><span class="key">↓</span> SOFT DROP</div>
                        <div><span class="key">SPACE</span> HARD DROP</div>
                        <div><span class="key">ESC</span> / <span class="key">P</span> PAUSE</div>
                        <div><span class="key">ENTER</span> RESTART</div>
                    </div>
                </footer>
            </div>
        </host>
    );
}, {
    props: {
        gameover: event<void>({ bubbles: true, composed: true }),
        linescleared: event<number>({ bubbles: true, composed: true }),
        scoreupdate: event<{ score: number; level: number; lines: number }>({ bubbles: true, composed: true })
    },
    styles: css`
        :host {
            display: block;
            outline: none;
            background-color: var(--tetris-bg, #000000);
            font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', Courier, monospace;
            color: #ffffff;
            padding: 30px;
            min-height: 100vh;
            box-sizing: border-box;
        }
        
        .game-container {
            max-width: 600px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 25px;
        }
        
        .game-header {
            text-align: center;
            margin-bottom: 10px;
        }
        
        .game-header h1 {
            font-size: 2.5rem;
            font-weight: 900;
            letter-spacing: 0.25em;
            margin: 0 0 6px 0;
            color: #ffffff;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.25);
        }
        
        .subtitle {
            font-size: 0.65rem;
            letter-spacing: 0.2em;
            color: rgba(255, 255, 255, 0.4);
            margin: 0;
        }
        
        .game-layout {
            display: flex;
            flex-direction: row;
            gap: 20px;
            align-items: flex-start;
            justify-content: center;
            width: 100%;
        }
        
        .game-footer {
            margin-top: 15px;
            width: 100%;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 20px;
        }
        
        .controls-guide {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.5);
            max-width: 460px;
            margin: 0 auto;
        }
        
        .controls-guide div {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .key {
            display: inline-block;
            background: #111111;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            padding: 2px 6px;
            color: #ffffff;
            font-weight: bold;
            font-size: 0.7rem;
            min-width: 18px;
            text-align: center;
        }
        
        @media (max-width: 600px) {
            .game-layout {
                flex-direction: column;
                align-items: center;
                gap: 20px;
            }
            .controls-guide {
                grid-template-columns: 1fr;
            }
        }
    `
});
