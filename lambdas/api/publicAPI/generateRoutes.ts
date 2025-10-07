import * as fs from "fs";
import * as path from "path";

const routesPath = path.resolve(__dirname, "./src/routes");
const { routes } = require(routesPath);

const outputPath = path.resolve(__dirname, "./routes.json");

const simplifiedRoutes: Record<string, string[]> = Object.entries(routes).reduce(
    (acc, [method, paths]) => {
        acc[method] = Object.keys(paths as Record<string, unknown>);
        return acc;
    },
    {} as Record<string, string[]>
);

fs.writeFileSync(outputPath, JSON.stringify(simplifiedRoutes, null, 2));
console.log(`✅ Generated routes.json at: ${outputPath}`);