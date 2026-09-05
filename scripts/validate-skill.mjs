import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const defaultOpenApiPath = path.resolve(root, "../appfunctor-openapi-skills-gateway/src/openapi.json");
const openApiPath = path.resolve(process.env.KELIRIJI_OPENAPI_PATH || defaultOpenApiPath);

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function markdownFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(absolutePath);
    return entry.name.endsWith(".md") ? [absolutePath] : [];
  });
}

const skill = read("skill/SKILL.md");
if (!skill.startsWith("---\nname: keliriji\n")) {
  failures.push("skill/SKILL.md must start with name: keliriji frontmatter");
}

for (const subject of ["yuwen", "math", "english"]) {
  if (!skill.includes(subject)) failures.push(`SKILL.md is missing subject ${subject}`);
}

if (!fs.existsSync(openApiPath)) {
  failures.push(`OpenAPI contract not found: ${openApiPath}; set KELIRIJI_OPENAPI_PATH when repositories are not siblings`);
}

const openApiDocument = fs.existsSync(openApiPath)
  ? JSON.parse(fs.readFileSync(openApiPath, "utf8"))
  : { paths: {} };
const availableOpenPaths = new Set(Object.keys(openApiDocument.paths || {}));

function toOpenApiPath(documentedPath) {
  return documentedPath.replace(/:([A-Za-z][A-Za-z0-9_]*)/g, "{$1}");
}

for (const absolutePath of markdownFiles(root)) {
  const relativePath = path.relative(root, absolutePath);
  const content = fs.readFileSync(absolutePath, "utf8");

  for (const match of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const target = match[1].split("#", 1)[0];
    if (!target || /^(https?:|mailto:)/.test(target)) continue;
    const resolved = path.resolve(path.dirname(absolutePath), decodeURIComponent(target));
    if (!fs.existsSync(resolved)) failures.push(`${relativePath}: broken link ${target}`);
  }

  if (/https?:\/\/[^\s)`]*fcapp\.run/i.test(content)) {
    failures.push(`${relativePath}: contains a direct Function Compute URL`);
  }

  for (const match of content.matchAll(/`(\/api\/v1\/open\/[^`]+)`/g)) {
    if (match[1] === "/api/v1/open/*") continue;
    if (!availableOpenPaths.has(toOpenApiPath(match[1]))) {
      failures.push(`${relativePath}: unverified Open API path ${match[1]}`);
    }
  }
}

if (!read("CHARTER.md").includes("未知学科不会静默回退到数学")) {
  failures.push("CHARTER.md must forbid silently defaulting unknown subjects to math");
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("keliriji skill validation passed");