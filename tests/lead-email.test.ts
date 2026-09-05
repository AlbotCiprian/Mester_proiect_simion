import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { renderHtml, renderText, toView } from "@/lib/notify";
import type { Lead } from "@/lib/lead";
import type { LeadMeta } from "@/lib/notify";

/**
 * The lead e-mail is the ONLY copy of a request (D-009). There is no database
 * to fall back on, no admin screen, no second notification. If a field is wrong
 * or missing here, it is wrong or missing forever.
 *
 * It is also the one artefact in this project rendered by software we do not
 * control — a dozen mail clients, each with its own idea of HTML — so the
 * things asserted below are the ones that break silently: escaping, the tap
 * targets, and the human-readable time.
 */

const lead: Lead = {
  name: "Albot Ciprian",
  phone: "+37368968633",
  service: "teracota-sobe",
  contactPreference: "telefon",
  email: "client@example.com",
  locality: "Chișinău",
  message: "Baie 6 m2.\nGresie 60x60.",
  consent: true,
} as Lead;

const meta: LeadMeta = {
  reference: "3410B136",
  locale: "ro",
  sourcePath: "/ro",
  source: "direct",
  consentVersion: "2026-08-19",
  // 22:19 UTC is 01:19 the NEXT DAY in Chișinău. Chosen deliberately: it is the
  // case where showing UTC misleads about both the hour and the date.
  consentAtIso: "2026-09-05T22:19:22.712Z",
};

describe("the lead e-mail says the right things", () => {
  const view = toView(lead, meta);
  const html = renderHtml(view);
  const text = renderText(view);

  it("shows the phone in the national form people read out", () => {
    assert.equal(view.phoneNational, "068 968 633");
    assert.ok(html.includes("068 968 633"), "national form missing from the HTML");
    assert.ok(text.includes("068 968 633"), "national form missing from the text");
  });

  it("makes the phone a tap target, not just text", () => {
    // The owner reads this on a phone while working. A number he cannot tap is
    // a number he has to retype one-handed.
    assert.match(html, /href="tel:\+37368968633"/, "the phone is not a tel: link");
  });

  it("keeps the E.164 form as well, for machines and for other countries", () => {
    assert.ok(html.includes("+37368968633"));
  });

  it("makes the customer's address a mailto and says Reply works", () => {
    assert.match(html, /href="mailto:client@example\.com"/);
    assert.match(html, /Reply/, "the mail does not mention that Reply reaches the client");
  });

  it("preserves the line breaks the customer typed", () => {
    // D-015: an earlier bug deleted them and fused the words either side.
    assert.ok(text.includes("Baie 6 m2.\nGresie 60x60."), "line breaks lost in the text part");
    assert.match(html, /white-space:pre-wrap/, "the HTML would collapse the line breaks");
  });

  it("shows the time in Chișinău, not raw UTC", () => {
    // 22:19Z is 01:19 the next day locally. Showing the ISO string told the
    // owner a lead arrived three hours before it did, on the wrong date.
    assert.doesNotMatch(html, /2026-09-05T22:19:22\.712Z/, "raw ISO leaked into the HTML");
    assert.ok(view.receivedAt.includes("01:19"), `local time wrong: ${view.receivedAt}`);
    assert.ok(view.receivedAt.includes("06"), `local date wrong: ${view.receivedAt}`);
  });

  it("still records the consent version — it is the only proof we have", () => {
    assert.ok(html.includes("2026-08-19"));
    assert.ok(text.includes("2026-08-19"));
    assert.match(html, /Acord/);
  });

  it("carries the reference, so the mailbox stays searchable", () => {
    assert.ok(html.includes("3410B136"));
    assert.ok(text.includes("3410B136"));
  });
});

describe("the lead e-mail cannot be used to inject markup", () => {
  it("escapes a hostile name, message and locality", () => {
    const hostile = toView(
      {
        ...lead,
        name: '<script>alert(1)</script>',
        locality: '" onmouseover="alert(2)',
        message: "<img src=x onerror=alert(3)>",
      } as Lead,
      meta,
    );
    const html = renderHtml(hostile);

    // Assert on the ESCAPING, not on the absence of scary substrings.
    // `&lt;img src=x onerror=alert(3)&gt;` legitimately contains "onerror=" and
    // is completely inert: the angle brackets are escaped, so nothing is a tag.
    // A test that banned the substring would fail on correct output and push
    // someone toward stripping the customer's words instead of escaping them.
    assert.ok(!html.includes("<script"), "an unescaped script tag survived");
    assert.ok(!html.includes("<img"), "an unescaped img tag survived");
    assert.ok(!html.includes('" onmouseover'), "an attribute break survived escaping");

    // …and the content is preserved, escaped, rather than silently dropped.
    assert.ok(html.includes("&lt;script&gt;"), "the name was dropped rather than escaped");
    assert.ok(html.includes("&lt;img src=x onerror=alert(3)&gt;"), "the message was dropped");
    assert.ok(html.includes("&quot; onmouseover"), "the locality was dropped");
  });

  it("renders without an e-mail, a locality or a message", () => {
    // Only name, phone, service and consent are required by the schema. The
    // optional blocks must disappear, not render empty labels.
    const bare = toView(
      { ...lead, email: undefined, locality: undefined, message: undefined } as unknown as Lead,
      meta,
    );
    const html = renderHtml(bare);
    assert.ok(!html.includes("mailto:"), "an empty e-mail block rendered");
    assert.ok(!html.includes("Ce a scris"), "an empty message block rendered");
    assert.ok(!html.includes("Localitate"), "an empty locality block rendered");
    // …but the things that always exist are still there.
    assert.ok(html.includes("Albot Ciprian"));
    assert.match(html, /href="tel:/);
  });
});

describe("the HTML survives the mail clients it will actually meet", () => {
  const html = renderHtml(toView(lead, meta));

  it("uses tables for layout, not flexbox or grid", () => {
    // Outlook renders with Word's engine and drops both.
    assert.ok(!html.includes("display:flex"), "flexbox will not survive Outlook");
    assert.ok(!html.includes("display:grid"), "grid will not survive Outlook");
    assert.match(html, /role="presentation"/, "layout tables must be hidden from screen readers");
  });

  it("inlines every style — no <style> block, no external CSS", () => {
    assert.ok(!html.includes("<style"), "a <style> block is stripped by several clients");
    assert.ok(!html.includes("<link"), "external CSS never loads in mail");
  });

  it("loads no remote images, which are blocked by default anyway", () => {
    assert.ok(!html.includes("<img"), "an image would render as a broken placeholder");
  });

  it("sets an explicit colour wherever it sets a background", () => {
    // A client that force-inverts for dark mode must not be able to leave dark
    // text on a dark ground.
    const backgrounds = html.match(/background:#[0-9a-f]{6}/gi) ?? [];
    assert.ok(backgrounds.length > 0, "no explicit backgrounds at all");
    assert.match(html, /color:#ffffff/i, "the call button has no explicit foreground");
  });
});
