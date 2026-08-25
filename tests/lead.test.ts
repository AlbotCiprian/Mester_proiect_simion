import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  fieldErrorsFrom,
  leadSchema,
  leadServiceLabels,
  leadServiceSlugs,
  normalizePhone,
} from "@/lib/lead";
import { services } from "@/lib/content";

const validLead = {
  name: "Ion Popescu",
  phone: "069123456",
  service: "renovari-bai",
  consent: true,
};

describe("normalizePhone", () => {
  it("accepts the ways a Moldovan number is actually written", () => {
    for (const input of ["069123456", "069 123 456", "069-123-456", "(069) 123 456"]) {
      assert.equal(normalizePhone(input), "+37369123456", input);
    }
  });

  it("accepts international and 00-prefixed forms", () => {
    assert.equal(normalizePhone("+37369123456"), "+37369123456");
    assert.equal(normalizePhone("+373 69 123 456"), "+37369123456");
    assert.equal(normalizePhone("0037369123456"), "+37369123456");
    assert.equal(normalizePhone("+40721234567"), "+40721234567");
  });

  it("accepts a bare 8-digit subscriber number with a real prefix", () => {
    assert.equal(normalizePhone("69123456"), "+37369123456");
    assert.equal(normalizePhone("79968387"), "+37379968387");
  });

  it("rejects a truncated national number instead of inventing one", () => {
    // The regression this guards: "06912345" once became "+37306912345",
    // an unreachable number handed to the owner as a real lead.
    assert.equal(normalizePhone("06912345"), null);
    assert.equal(normalizePhone("0912345"), null);
  });

  it("rejects junk", () => {
    for (const input of ["", "123", "abc", "069123456789012345", "+", "++37369123456", "06x123456"]) {
      assert.equal(normalizePhone(input), null, input);
    }
  });

  it("never lets a newline survive into the output", () => {
    const out = normalizePhone("069\n123456");
    assert.ok(out === null || !/[\r\n]/.test(out));
  });
});

describe("leadSchema", () => {
  it("accepts a minimal valid lead and returns E.164", () => {
    const parsed = leadSchema.safeParse(validLead);
    assert.ok(parsed.success);
    assert.equal(parsed.data.phone, "+37369123456");
    assert.equal(parsed.data.contactPreference, "telefon");
  });

  it("rejects a missing consent", () => {
    const parsed = leadSchema.safeParse({ ...validLead, consent: false });
    assert.equal(parsed.success, false);
    assert.match(fieldErrorsFrom(parsed.error!).consent ?? "", /acordul/i);
  });

  it("rejects a name made only of invisible characters", () => {
    const parsed = leadSchema.safeParse({ ...validLead, name: "​​​" });
    assert.equal(parsed.success, false);
  });

  it("strips control characters from free text", () => {
    const parsed = leadSchema.safeParse({ ...validLead, name: "Ion Popescu" });
    assert.ok(parsed.success);
    assert.equal(parsed.data.name, "Ion Popescu");
  });

  it("requires an e-mail when e-mail is the chosen contact method", () => {
    const parsed = leadSchema.safeParse({ ...validLead, contactPreference: "email" });
    assert.equal(parsed.success, false);
    assert.match(fieldErrorsFrom(parsed.error!).email ?? "", /e-mail/i);
  });

  it("accepts an empty optional e-mail", () => {
    assert.ok(leadSchema.safeParse({ ...validLead, email: "" }).success);
  });

  it("rejects a malformed e-mail", () => {
    assert.equal(leadSchema.safeParse({ ...validLead, email: "nope@" }).success, false);
  });

  it("rejects an unknown service slug", () => {
    assert.equal(leadSchema.safeParse({ ...validLead, service: "altceva-inventat" }).success, false);
  });

  it("rejects an over-long message", () => {
    assert.equal(leadSchema.safeParse({ ...validLead, message: "x".repeat(1501) }).success, false);
  });

  it("rejects a filled honeypot", () => {
    assert.equal(leadSchema.safeParse({ ...validLead, website: "http://spam" }).success, false);
  });
});

describe("fieldErrorsFrom", () => {
  it("never returns an empty map for a failed parse", () => {
    const parsed = leadSchema.safeParse({});
    assert.equal(parsed.success, false);
    assert.ok(Object.keys(fieldErrorsFrom(parsed.error!)).length > 0);
  });

  it("keeps the first message per field", () => {
    const parsed = leadSchema.safeParse({ ...validLead, name: "" });
    const errors = fieldErrorsFrom(parsed.error!);
    assert.equal(typeof errors.name, "string");
  });
});

describe("service catalogue", () => {
  it("stays in step with lib/content.ts", () => {
    // leadServiceSlugs is an explicit tuple for type-safety, so it can drift
    // from the rendered service grid. This is the guard.
    const contentSlugs = services.map((s) => s.slug).sort();
    const formSlugs = leadServiceSlugs.filter((s) => s !== "altceva").sort();
    assert.deepEqual(formSlugs, contentSlugs);
  });

  it("has a label for every slug", () => {
    for (const slug of leadServiceSlugs) {
      assert.equal(typeof leadServiceLabels[slug], "string");
    }
  });
});
