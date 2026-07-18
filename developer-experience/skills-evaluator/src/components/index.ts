import { TetrisGame } from "./tetris-game.js";
import { TetrisBoard } from "./tetris-board.js";
import { TetrisStats } from "./tetris-stats.js";

customElements.define("tetris-game", TetrisGame);
customElements.define("tetris-board", TetrisBoard);
customElements.define("tetris-stats", TetrisStats);

export { TetrisGame, TetrisBoard, TetrisStats };
