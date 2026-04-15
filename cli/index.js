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

    // 4. Copy ATOMICO-INSTRUCTIONS.md
    const sourceInstrPath = path.join(
        sourceAgentsPath,
        "ATOMICO-INSTRUCTIONS.md"
    );
    const destInstrPath = path.join(destAgentsPath, "ATOMICO-INSTRUCTIONS.md");
    if (fs.existsSync(sourceInstrPath)) {
        fs.cpSync(sourceInstrPath, destInstrPath, { force: true });
    }

    // 5. Append Rule to user's INSTRUCTIONS.md or README.md
    const userInstrPath = path.join(destAgentsPath, "INSTRUCTIONS.md");
    const userReadmePath = path.join(process.cwd(), "README.md");
    const ruleText =
        "\n> Whenever you are requested to create a component with Atomico as a dependency, always verify if the context considers the ATOMICO-INSTRUCTIONS.md file and its skills.";

    let appended = false;

    if (fs.existsSync(userInstrPath)) {
        const text = fs.readFileSync(userInstrPath, "utf-8");
        if (!text.includes("ATOMICO-INSTRUCTIONS.md")) {
            fs.appendFileSync(userInstrPath, "\n" + ruleText);
        }
        appended = true;
    } else if (fs.existsSync(userReadmePath)) {
        const text = fs.readFileSync(userReadmePath, "utf-8");
        if (!text.includes("ATOMICO-INSTRUCTIONS.md")) {
            fs.appendFileSync(userReadmePath, "\n" + ruleText);
        }
        appended = true;
    }

    if (!appended) {
        // Create an INSTRUCTIONS.md dynamically if neither existed
        fs.writeFileSync(
            userInstrPath,
            "# AI Agents Instructions\n" + ruleText
        );
    }

    console.log(
        "✅ Atomico AI Skills successfully installed/updated in your project."
    );
} else {
    console.log(
        "Command not recognized. Try using: npx atomico install skills"
    );
}
