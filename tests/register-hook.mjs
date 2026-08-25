// Registers the alias/stub resolver for `node --test`. Kept separate from the
// hook itself because module hooks must be registered from a different module
// than the one that defines them.
import { register } from "node:module";
register("./alias-hook.mjs", import.meta.url);
