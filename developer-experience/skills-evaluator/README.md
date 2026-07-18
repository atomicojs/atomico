# Atomico Evaluation Sandbox (Gemini)

> [!IMPORTANT]
> **Cognitive Directive**: Before initiating any action, tool call, or web search, you are strictly required to read, index, and apply the specialized design and architecture instructions declared in your local `.agents/skills/` directory. Do not perform external scaffolding searches or initializations, as the environment is already pre-configured.

Welcome to the skill evaluation workspace. The goal of this environment is to assess the engineering quality and architecture of custom interfaces built using **Atomico.js**.

## The Task: Minimalist Negative High-Contrast Tetris Game

Build a fully functional, highly polished, and responsive **Tetris-like Game** inside the `./src/` directory. The application must adhere to a strict **minimalist, negative high-contrast visual style** and follow core Tetris mechanics powered entirely by Atomico Web Components.

### Functional Requirements

1. **Game Board (`<tetris-board>`)**:
   - Grid size must be strictly 10 columns by 20 rows.
   - Must render the active falling tetromino, the shadow (ghost piece showing where it will land), and all previously locked grid cells.
   - Clean grid lines defining the cell boundaries in a stark, minimalist fashion.

2. **Game Logic & State**:
   - Standard 7 Tetrominoes (I, O, T, S, Z, J, L) with their respective rotation logic (Standard Rotation System or simplified version).
   - Random generator for piece selection (e.g., random bag generator).
   - Game loop running on a dynamic interval/tick that speeds up as the level increases.
   - Line clearing detection, scoring system (based on number of lines cleared simultaneously), line count, and level tracker.
   - Game over state detection (when a new piece cannot spawn at the top of the grid).
   - Pause / Resume state.

3. **Stats & Preview Panel (`<tetris-stats>`)**:
   - Display the next incoming tetromino preview.
   - Display the current Score, Level, and Lines cleared.
   - Highly structured layout sitting alongside or embedded within the board wrapper.

### Aesthetic & Visual Requirements (Minimalist Negative High-Contrast)

To deliver a premium, starkly industrial and retro-modern feel, implement a strict negative high-contrast design system:
- **Color Palette**: 
  - Absolute pitch black (`#000000`) or deep carbon (`#0a0a0a`) background.
  - Crisp, stark white (`#ffffff`) or radioactive neon lines (e.g. vibrant neon green `#00ff66` or cyber cyan `#00e5ff`) for active elements, borders, and UI text.
  - Keep colors to a bare minimum: negative space is the primary design element. Avoid muddy gradients or warm tones.
- **Visual Styles**:
  - Thin, crisp 1px borders for the board grid and outer cards.
  - Ghost piece (drop preview) represented using thin dotted/dashed white outlines or low-opacity white borders.
  - Monospaced typography (e.g. `Courier New`, `JetBrains Mono`, `Fira Code`) for stats, titles, and menus.
  - Minimal UI animations: sharp transition effects, grid flash upon line clearance, and a pulsing screen effect for Game Over.

### Keyboard Interaction Rules (Hotkeys)

The game must respond instantly to the following keyboard events:
- **ArrowLeft / ArrowRight**: Move the active tetromino horizontally.
- **ArrowUp**: Rotate the tetromino clockwise.
- **ArrowDown**: Soft drop (accelerate tetromino downward).
- **Space**: Hard drop (instantly drop the piece to the bottom and lock it, triggering a subtle visual grid flash).
- **Escape / P**: Pause or resume the game.
- **Enter**: Start or restart the game after a Game Over.

---

## Architectural Constraints (Atomico.js)

Your implementation must fully align with the local Atomico.js best practices:
1. **Separated Registration**: Never register components inside their own definition files. Keep `customElements.define` inside a centralized `src/components/index.ts` file.
2. **Proper Component Split**: Organize the game into modular subcomponents (e.g. `<tetris-game>`, `<tetris-board>`, `<tetris-stats>`, etc.).
3. **Prop-Driven Communication**: Pass game state down via props; bubble up user actions or state changes via custom events (e.g., `gameover`, `linescleared`).
4. **Clean CSS Custom Properties**: Use CSS variables extensively for custom theme tokens (`--tetris-bg`, `--tetris-border`, `--tetris-grid-color`) to control states and borders.
5. **No Void Callbacks**: Always use custom `event()` hooks with `bubbles: true, composed: true` to notify parents of score updates, instead of passing void callback props.

---

## How to Proceed

1. Analyze this workspace and the available local agents/skills under `.agents/skills/`.
2. Implement the entire game inside the `./src/components/` and `./src/` directories.
3. Ensure everything compiles cleanly using `npm run test:ts` and works flawlessly without human intervention.
