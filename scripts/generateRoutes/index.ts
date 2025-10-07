import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const projectRoot = path.resolve(__dirname, "../..");
const lambdasRoot = path.join(projectRoot, "lambdas/api");
const outputFile = path.join(projectRoot, "infra/generated_routes.json");

console.log("[INFO] Scanning for lambdas in:", lambdasRoot);

const lambdas = fs.readdirSync(lambdasRoot);
const aggregated: Record<string, unknown> = {};

for (const lambda of lambdas) {
    const lambdaDir = path.join(lambdasRoot, lambda);
    const generateScript = path.join(lambdaDir, "generateRoutes.ts");

    if (!fs.existsSync(generateScript)) {
        console.log(`[SKIP] ${lambda} has no generateRoutes.ts`);
        continue;
    }

    console.log(`[RUN] Generating routes for ${lambda}...`);

    const result = spawnSync("npm", ["run", "generate:routes"], {
        cwd: lambdaDir,
        stdio: "inherit",
        shell: true,
    });

    if (result.status !== 0) {
        console.error(`[ERROR] Failed to generate routes for ${lambda}`);
        continue;
    }

    const routesFile = path.join(lambdaDir, "routes.json");
    if (!fs.existsSync(routesFile)) {
        console.warn(`[WARN] ${lambda} has no routes.json after generation`);
        continue;
    }

    const raw = JSON.parse(fs.readFileSync(routesFile, "utf8"));
    const normalizedRoutes: string[] = Object.entries(raw).flatMap(([method, value]) => {
        if (Array.isArray(value)) {
            return value.map((p) => `${method} ${p}`);
        }
        if (value && typeof value === "object") {
            return Object.keys(value as Record<string, unknown>).map((p) => `${method} ${p}`);
        }
        console.warn(`[WARN] ${lambda} has unexpected routes format for method ${method}`);
        return [];
    });
    aggregated[lambda] = {
        lambda_name: lambda,
        routes: normalizedRoutes,
    };
}

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(aggregated, null, 2));
console.log(`✅ Wrote combined routes to ${outputFile}`);