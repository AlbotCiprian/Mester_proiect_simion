// `server-only` throws by design when imported outside a React Server Component.
// Under `node --test` there is no RSC boundary, so it is replaced by this no-op.
// The guard still does its real job at build time, which is where it matters.
export {};
