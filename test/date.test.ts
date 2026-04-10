import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { polyfillDate } from "../src/date";

describe("polyfillDate", () => {
  let origNow: any;
  let origToISOString: any;
  let origToJSON: any;

  beforeEach(() => {
    origNow = Date.now;
    origToISOString = Date.prototype.toISOString;
    origToJSON = Date.prototype.toJSON;
    delete (Date as any).now;
    delete Date.prototype.toISOString;
    delete Date.prototype.toJSON;
  });

  afterEach(() => {
    (Date as any).now = origNow;
    Date.prototype.toISOString = origToISOString;
    Date.prototype.toJSON = origToJSON;
  });

  it("Date.now returns a number", () => {
    polyfillDate();
    expect(typeof Date.now()).toBe("number");
  });

  it("Date.now returns value close to new Date().getTime()", () => {
    polyfillDate();
    const diff = Math.abs(Date.now() - new Date().getTime());
    expect(diff).toBeLessThan(100);
  });

  it("toISOString returns ISO 8601 format", () => {
    polyfillDate();
    const d = new Date(Date.UTC(2024, 0, 15, 10, 30, 45, 123));
    const iso = d.toISOString();
    expect(iso).toBe("2024-01-15T10:30:45.123Z");
  });

  it("toISOString zero-pads all fields", () => {
    polyfillDate();
    const d = new Date(Date.UTC(2024, 0, 1, 0, 0, 0, 0));
    expect(d.toISOString()).toBe("2024-01-01T00:00:00.000Z");
  });

  it("toJSON returns same as toISOString", () => {
    polyfillDate();
    const d = new Date(Date.UTC(2024, 5, 20));
    expect(d.toJSON()).toBe(d.toISOString());
  });

  it("does not overwrite existing methods", () => {
    const fakeNow = () => 42;
    (Date as any).now = fakeNow;
    polyfillDate();
    expect(Date.now()).toBe(42);
    (Date as any).now = origNow; // restore for afterEach
  });
});
