import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const promptsPath = path.join(__dirname, "prompts.json");
const sandboxDir = path.join(__dirname, "sandbox");
const prompts = JSON.parse(fs.readFileSync(promptsPath, "utf8"));

if (!fs.existsSync(sandboxDir)) {
    fs.mkdirSync(sandboxDir);
}

console.log("Iniciando evaluación de Skills de Atomico en modo Sandbox...\n");

for (const p of prompts) {
    const outFile = path.join(sandboxDir, `${p.id}.tsx`);
    // Le pedimos explícitamente a la IA que retorne el código
    const fullPrompt = `${p.prompt} Solo retorna el código en un bloque markdown de typescript.`;

    console.log(`=================================================`);
    console.log(`Evaluando prompt [${p.id}]`);
    console.log(`-------------------------------------------------`);

    let attempt = 1;
    const maxAttempts = 3;
    let percentage = 0;

    while (attempt <= maxAttempts && percentage < 90) {
        console.log(`\nIntento ${attempt}...`);
        try {
            // Ejecutamos gemini cli
            // Agregamos timeout alto por la latencia esperada
            const output = execSync(
                `gemini prompt "${fullPrompt.replace(/"/g, '\\"')}"`,
                {
                    encoding: "utf8",
                    stdio: ["pipe", "pipe", "ignore"],
                    timeout: 120000
                }
            );

            // Guardamos el output en la carpeta sandbox (No se elimina, sirve para debug)
            // Si hay iteraciones, sobreescribe con la versión más reciente
            fs.writeFileSync(outFile, output, "utf8");

            let score = 0;
            let checks = [];

            const hasHost = output.includes("<host");
            checks.push({ name: "Retorna <host> como raíz", pass: hasHost });
            if (hasHost) score++;

            const avoidsUseState = p.prompt.includes("no uses useState")
                ? !output.includes("useState(")
                : true;
            const usesUseProp =
                output.includes("useProp(") || !output.includes("useState(");
            const stateScorePass = avoidsUseState && usesUseProp;
            checks.push({
                name: "Uso correcto de estados (useProp preferido o evita useState)",
                pass: stateScorePass
            });
            if (stateScorePass) score++;

            const hasCss = output.includes("css`");
            checks.push({
                name: "Declara estilos con literal template css`...`",
                pass: hasCss
            });
            if (hasCss) score++;

            const hasC = output.includes("c(");
            checks.push({
                name: "Usa la función constructora c() en formato inline",
                pass: hasC
            });
            if (hasC) score++;

            const isExported =
                output.includes("export const ") ||
                output.includes("export function ");
            checks.push({
                name: "Exporta la instancia del componente",
                pass: isExported
            });
            if (isExported) score++;

            percentage = (score / 5) * 100;

            console.log(
                `Resultados de Evaluación: ${percentage}% de precisión`
            );
            checks.forEach((c) =>
                console.log(`  [${c.pass ? "✓" : "x"}] ${c.name}`)
            );

            if (percentage >= 90) {
                console.log(
                    `✅ ¡Éxito en el intento ${attempt}! Componente guardado en sandbox/${p.id}.md`
                );
                break;
            } else {
                console.log(
                    `⚠️ Falló el umbral del 90%. El agente no aplicó todas las reglas. Iterando...`
                );
                attempt++;
            }
        } catch (e) {
            console.error(`Error en intento ${attempt}:`, e.message);
            attempt++;
        }
    }
}
