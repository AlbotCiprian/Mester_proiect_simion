/**
 * Module resolver hook for `node --test`.
 *
 * Two jobs, both tiny:
 *  1. map the `@/` path alias from tsconfig to the repo root;
 *  2. stub `server-only`, which throws by design outside a React Server
 *     Component and would otherwise make every server module untestable.
 *
 * Deliberately NOT Vitest or Jest: there are nine pure functions here, no DOM,
 * no JSX and no module mocking. Node 24 strips TypeScript types natively, so a
 * test runner would add a dependency tree and a config file to solve nothing.
 */
import { pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SERVER_ONLY_STUB = pathToFileURL(path.join(ROOT, "tests", "server-only-stub.mjs")).href;

/** TypeScript imports are extensionless; Node's resolver is not. */
const CANDIDATES = ["", ".ts", ".tsx", ".mjs", ".js", "/index.ts", "/index.tsx"];

function resolveAlias(specifier) {
  const base = path.join(ROOT, specifier.slice(2));
  for (const suffix of CANDIDATES) {
    const candidate = `${base}${suffix}`;
    if (existsSync(candidate) && path.extname(candidate)) return candidate;
  }
  return null;
}

export function resolve(specifier, context, nextResolve) {
  if (specifier === "server-only") {
    return { url: SERVER_ONLY_STUB, shortCircuit: true };
  }
  if (specifier.startsWith("@/")) {
    const resolved = resolveAlias(specifier);
    if (resolved) return { url: pathToFileURL(resolved).href, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}
