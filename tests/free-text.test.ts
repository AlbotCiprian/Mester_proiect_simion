import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { leadSchema } from "@/lib/lead";

/**
 * Regression suite for the free-text sanitiser.
 *
 * The bug this exists to prevent: the invisible-character class covered the
 * whole C0 range (codepoints 0 to 31), which includes TAB, LF and CR, and
 * clean() replaced the whole class with the empty string. Every multi-line
 * message therefore had its line breaks DELETED rather than normalised, fusing
 * the words on either side ("Baie 6 m2." + "Gresie 60x60." became one word).
 *
 * The characters are built from codepoints rather than written as escapes, so
 * no editor, shell or copy-paste step can quietly alter them.
 */

const LF = String.fromCharCode(10);
const CR = String.fromCharCode(13);
const TAB = String.fromCharCode(9);
const NUL = String.fromCharCode(0);
const ZWSP = String.fromCharCode(0x200b);

const validLead = {
  name: "Ion Popescu",
  phone: "069123456",
  service: "renovari-bai",
  consent: true,
} as const;

describe("message field", () => {
  it("keeps line breaks", () => {
    const message = `Baie 6 m2.${LF}Gresie 60x60.${LF}${LF}Termen: octombrie.`;
    const parsed = leadSchema.safeParse({ ...validLead, message });
    assert.ok(parsed.success);
    assert.equal(parsed.data.message, message);
  });

  it("collapses runaway blank lines down to one paragraph break", () => {
    const parsed = leadSchema.safeParse({ ...validLead, message: `a${LF.repeat(5)}b` });
    assert.ok(parsed.success);
    assert.equal(parsed.data.message, `a${LF}${LF}b`);
  });

  it("normalises CRLF and a bare CR to LF", () => {
    const parsed = leadSchema.safeParse({ ...validLead, message: `a${CR}${LF}b${CR}c` });
    assert.ok(parsed.success);
    assert.equal(parsed.data.message, `a${LF}b${LF}c`);
  });

  it("still removes a genuine control character", () => {
    const parsed = leadSchema.safeParse({ ...validLead, message: `Baie${NUL} mica` });
    assert.ok(parsed.success);
    assert.equal(parsed.data.message, "Baie mica");
  });
});

describe("single-line fields", () => {
  it("folds tabs and newlines into one space in the name", () => {
    const parsed = leadSchema.safeParse({ ...validLead, name: `Ion${TAB}${LF}Popescu` });
    assert.ok(parsed.success);
    assert.equal(parsed.data.name, "Ion Popescu");
  });

  it("folds whitespace in the locality", () => {
    const parsed = leadSchema.safeParse({ ...validLead, locality: `Chisinau,${LF}  Botanica` });
    assert.ok(parsed.success);
    assert.equal(parsed.data.locality, "Chisinau, Botanica");
  });

  it("still rejects a name made only of zero-width characters", () => {
    const parsed = leadSchema.safeParse({ ...validLead, name: ZWSP.repeat(4) });
    assert.equal(parsed.success, false);
  });

  it("keeps diacritics intact", () => {
    const parsed = leadSchema.safeParse({ ...validLead, name: "Ștefan Ionașcu" });
    assert.ok(parsed.success);
    assert.equal(parsed.data.name, "Ștefan Ionașcu");
  });
});
