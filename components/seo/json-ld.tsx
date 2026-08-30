import { jsonLdGraph } from "@/lib/schema";

/**
 * Server Component. The payload is built from typed builders in lib/schema.ts
 * and serialised with JSON.stringify, so no user input reaches it and the
 * `<` escape below is belt-and-braces against a future content edit that
 * introduces one.
 */
export function JsonLd({ nodes }: { nodes: Record<string, unknown>[] }) {
  const json = jsonLdGraph(nodes).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
