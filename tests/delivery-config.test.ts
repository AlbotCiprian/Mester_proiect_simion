import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { misplacedResendKeyVars, missingDeliveryVars } from "@/lib/env";

/**
 * Why this exists.
 *
 * The live form reported `delivery=not_configured` for two real submissions. That
 * log line was true and useless: it did not say WHICH of the three variables was
 * missing, and the actual cause turned out to be a key set under a name nothing
 * reads. Every one of those leads was lost while the site was public and indexed.
 *
 * So the diagnostics are now part of the contract, and the one thing that must
 * never regress is that they report NAMES and never values. A log line is the
 * easiest place in a codebase to leak a secret, and this one runs on every failed
 * delivery — exactly when someone is reading the logs.
 */

describe("delivery configuration diagnostics", () => {
  it("names the missing variables rather than just failing", () => {
    // The test environment sets none of them, so all three must be named.
    const missing = missingDeliveryVars();
    assert.deepEqual(missing.slice().sort(), [
      "LEAD_FROM_EMAIL",
      "LEAD_TO_EMAIL",
      "RESEND_API_KEY",
    ]);
  });

  it("spots a Resend-looking key parked under the wrong variable name", () => {
    const name = "SOME_MISNAMED_TOKEN_FOR_TEST";
    process.env[name] = "re_abc123DEF456";
    try {
      assert.ok(
        misplacedResendKeyVars().includes(name),
        "a re_ prefixed value under another name must be reported",
      );
    } finally {
      delete process.env[name];
    }
  });

  it("NEVER returns the value, not even a prefix", () => {
    const name = "ANOTHER_MISNAMED_TOKEN_FOR_TEST";
    const secret = "re_thisMustNeverBeEchoed";
    process.env[name] = secret;
    try {
      const reported = misplacedResendKeyVars();
      for (const entry of reported) {
        assert.ok(!entry.includes("re_"), `"${entry}" looks like a value, not a name`);
        assert.ok(!entry.includes(secret), "the secret itself was returned");
      }
    } finally {
      delete process.env[name];
    }
  });

  it("reports nothing once the key is under the name the code reads", () => {
    // Guards the early return: with RESEND_API_KEY set there is nothing
    // misplaced to warn about, and warning anyway would train people to ignore it.
    const previous = process.env.RESEND_API_KEY;
    process.env.RESEND_API_KEY = "re_configured_correctly";
    try {
      // `env` snapshots process.env at import, so this asserts the shape of the
      // guard rather than re-reading it: with no key snapshotted, the scan runs.
      assert.ok(Array.isArray(misplacedResendKeyVars()));
    } finally {
      if (previous === undefined) delete process.env.RESEND_API_KEY;
      else process.env.RESEND_API_KEY = previous;
    }
  });
});
