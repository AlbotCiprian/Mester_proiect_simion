import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clientIpFrom, hashIp, rateLimit, rateLimitPeek } from "@/lib/rate-limit";

describe("rateLimit", () => {
  it("allows up to the limit and refuses past it", () => {
    const key = `test-basic-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      assert.equal(rateLimit(key, 3, 60_000).ok, true, `call ${i + 1}`);
    }
    assert.equal(rateLimit(key, 3, 60_000).ok, false);
  });

  it("reports remaining and a retry hint", () => {
    const key = `test-remaining-${Math.random()}`;
    assert.equal(rateLimit(key, 2, 60_000).remaining, 1);
    const second = rateLimit(key, 2, 60_000);
    assert.equal(second.remaining, 0);
    assert.ok(second.retryAfterSeconds > 0 && second.retryAfterSeconds <= 60);
  });

  it("starts a fresh window once the old one expires", () => {
    const key = `test-window-${Math.random()}`;
    assert.equal(rateLimit(key, 1, 1).ok, true);
    const start = Date.now();
    while (Date.now() - start < 5) { /* wait out the 1ms window */ }
    assert.equal(rateLimit(key, 1, 1).ok, true);
  });

  it("keeps separate keys independent", () => {
    const a = `test-a-${Math.random()}`;
    const b = `test-b-${Math.random()}`;
    rateLimit(a, 1, 60_000);
    assert.equal(rateLimit(a, 1, 60_000).ok, false);
    assert.equal(rateLimit(b, 1, 60_000).ok, true);
  });

  it("peeks without consuming", () => {
    const key = `test-peek-${Math.random()}`;
    assert.equal(rateLimitPeek(key), 0);
    rateLimit(key, 5, 60_000);
    assert.equal(rateLimitPeek(key), 1);
    assert.equal(rateLimitPeek(key), 1);
  });
});

describe("clientIpFrom", () => {
  it("prefers the platform header over a spoofable one", () => {
    const headers = new Headers({
      "x-forwarded-for": "1.1.1.1, 2.2.2.2",
      "x-vercel-forwarded-for": "9.9.9.9",
    });
    assert.equal(clientIpFrom(headers), "9.9.9.9");
  });

  it("takes the LAST x-forwarded-for entry, not the first", () => {
    // The regression this guards: the first entry is attacker-controlled, so
    // trusting it made the limiter a one-line bypass via header rotation.
    const headers = new Headers({ "x-forwarded-for": "203.0.113.9, 198.51.100.7" });
    assert.equal(clientIpFrom(headers), "198.51.100.7");
  });

  it("falls back to a shared bucket rather than to no limiting", () => {
    assert.equal(clientIpFrom(new Headers()), "unknown");
  });
});

describe("hashIp", () => {
  it("is stable and never returns the raw address", () => {
    const hashed = hashIp("203.0.113.9");
    assert.equal(hashed, hashIp("203.0.113.9"));
    assert.ok(!hashed.includes("203.0.113.9"));
    assert.equal(hashed.length, 16);
  });

  it("separates different addresses", () => {
    assert.notEqual(hashIp("203.0.113.9"), hashIp("203.0.113.10"));
  });
});
