import { Project } from "ts-morph";
import * as path from "path";
import * as fs from "fs";

const project = new Project();
const routesFile = project.addSourceFileAtPath(path.resolve(__dirname, "./src/routes.ts"));

// Get the `routes` declaration
const routesVar = routesFile.getVariableDeclarationOrThrow("routes");
const text = routesVar.getInitializerOrThrow().getText();

// Simple regex to match route strings like "/collections", "/photos/{id}"
const pathRegex = /["'`](\/[A-Za-z0-9\/_\-{}]+)["'`]\s*:/g;

const matches = [...text.matchAll(pathRegex)].map(m => m[1]);

const output: Record<string, string[]> = { GET: matches };

const outputPath = path.resolve(__dirname, "./routes.json");
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log(`✅ Extracted routes: ${matches.length}`);