#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const [, , command, subCommand] = process.argv;

if (command === "install" && subCommand === "skills") {
    // 1. Resolve source and destination
    const sourceAgentsPath = path.join(__dirname, "../.agents");
    const destAgentsPath = path.join(process.cwd(), ".agents");

    // 2. Ensure destination exists
    if (!fs.existsSync(destAgentsPath)) {
        fs.mkdirSync(destAgentsPath, { recursive: true });
    }

    // 3. Copy Skills (merging logic: recursive: true, force: true)
    // fs.cpSync is available in Node > 16.7
    const sourceSkills = path.join(sourceAgentsPath, "skills");
    const destSkills = path.join(destAgentsPath, "skills");
    if (fs.existsSync(sourceSkills)) {
        fs.cpSync(sourceSkills, destSkills, { recursive: true, force: true });
    }

    console.log(
        "✅ Atomico AI Skills successfully installed/updated in your project."
    );
} else {
    console.log(
        "Command not recognized. Try using: npx atomico install skills"
    );
}
