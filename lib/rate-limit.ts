import "server-only";

import { createHmac } from "node:crypto";

/**
 * Fixed-window in-memory rate limiter.
 *
 * KNOWN LIMITATION, recorded rather than glossed over (DECISIONS D-009): on
 * Vercel each serverless instance keeps its own map and a cold start resets every
 * counter, so the effective ceiling is `instances x limit` with the instance count
 * unobservable. This stops a naive loop, a double submit and a low-effort script.
 * It does NOT stop a distributed attacker, and it must not be reported as
 * "rate limiting implemented" at the release gate — Turnstile is the real control.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Hard ceiling on tracked keys, so an IP-rotation attack cannot grow the map. */
const MAX_KEYS = 5000;
let nextSweepAt = 0;

/**
 * Amortised cleanup. The previous version only ran above 500 live keys and then
 * scanned the whole map on EVERY call while deleting nothing — turning the
 * limiter into a CPU amplifier under exactly the attack it defends against.
 */
function sweep(now: number) {
  if (now < nextSweepAt && buckets.size < MAX_KEYS) return;
  nextSweepAt = now + 60_000;

  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  // Still oversized after expiry cleanup: evict oldest-inserted keys. Map
  // preserves insertion order, so the first entries are the stalest.
  if (buckets.size > MAX_KEYS) {
    const excess = buckets.size - MAX_KEYS;
    let removed = 0;
    for (const key of buckets.keys()) {
      buckets.delete(key);
      if (++removed >= excess) break;
    }
  }
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSeconds: Math.ceil(windowMs / 1000) };
  }

  existing.count += 1;
  const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
  return {
    ok: existing.count <= limit,
    remaining: Math.max(0, limit - existing.count),
    retryAfterSeconds,
  };
}

/** Peek without consuming, for a second counter that shares a key. */
export function rateLimitPeek(key: string): number {
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= Date.now()) return 0;
  return bucket.count;
}

/**
 * Client IP from proxy headers.
 *
 * `x-forwarded-for` is APPENDED to by each hop, so its FIRST entry is whatever
 * the caller wrote — trusting it makes the limiter a one-line bypass (rotate the
 * header per request). Prefer the platform's own header, then the last
 * x-forwarded-for entry, which is the one the edge itself observed.
 */
export function clientIpFrom(headers: Headers): string {
  const vercel = headers.get("x-vercel-forwarded-for")?.trim();
  if (vercel) return vercel.split(",").pop()?.trim() || "unknown";

  const real = headers.get("x-real-ip")?.trim();
  if (real) return real;

  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const last = forwarded.split(",").pop()?.trim();
    if (last) return last;
  }
  // No proxy headers at all (local dev): one shared bucket beats no limiting.
  return "unknown";
}

/**
 * A raw IP is personal data under Law 133/2011, so it must not sit in a map key
 * or reach a log line. The salt only needs to be stable per deployment; a missing
 * one degrades to a fixed string, which still prevents the raw value leaking.
 */
export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "dev-salt-not-secret";
  return createHmac("sha256", salt).update(ip).digest("base64url").slice(0, 16);
}
