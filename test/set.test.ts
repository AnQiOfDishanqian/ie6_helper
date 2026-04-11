import { describe, it, expect } from "vitest";
import { polyfillSet, IE6Set } from "../src/set";

describe("IE6Set - basic", () => {
  it("creates empty set", () => {
    var s = new IE6Set();
    expect(s.size).toBe(0);
  });

  it("creates set from array", () => {
    var s = new IE6Set([1, 2, 3]);
    expect(s.size).toBe(3);
    expect(s.has(1)).toBe(true);
    expect(s.has(2)).toBe(true);
    expect(s.has(3)).toBe(true);
  });

  it("deduplicates values from iterable", () => {
    var s = new IE6Set([1, 2, 2, 3, 1]);
    expect(s.size).toBe(3);
  });
});

describe("IE6Set - add/has", () => {
  it("adds values", () => {
    var s = new IE6Set();
    s.add(1);
    expect(s.has(1)).toBe(true);
    expect(s.has(2)).toBe(false);
  });

  it("add returns the set for chaining", () => {
    var s = new IE6Set();
    var result = s.add(1).add(2).add(3);
    expect(result).toBe(s);
    expect(s.size).toBe(3);
  });

  it("ignores duplicate adds", () => {
    var s = new IE6Set();
    s.add(1);
    s.add(1);
    expect(s.size).toBe(1);
  });

  it("supports NaN", () => {
    var s = new IE6Set();
    s.add(NaN);
    expect(s.has(NaN)).toBe(true);
    s.add(NaN);
    expect(s.size).toBe(1);
  });

  it("supports object values", () => {
    var s = new IE6Set();
    var obj = {};
    s.add(obj);
    expect(s.has(obj)).toBe(true);
    expect(s.has({})).toBe(false);
  });

  it("distinguishes 0 from -0", () => {
    var s = new IE6Set();
    s.add(0);
    s.add(-0);
    // SameValueZero: 0 === -0
    expect(s.size).toBe(1);
  });
});

describe("IE6Set - delete", () => {
  it("deletes existing value and returns true", () => {
    var s = new IE6Set();
    s.add(1);
    expect(s.delete(1)).toBe(true);
    expect(s.has(1)).toBe(false);
    expect(s.size).toBe(0);
  });

  it("returns false for missing value", () => {
    var s = new IE6Set();
    expect(s.delete(1)).toBe(false);
  });
});

describe("IE6Set - clear", () => {
  it("removes all values", () => {
    var s = new IE6Set();
    s.add(1);
    s.add(2);
    s.clear();
    expect(s.size).toBe(0);
    expect(s.has(1)).toBe(false);
  });
});

describe("IE6Set - forEach", () => {
  it("iterates all values", () => {
    var s = new IE6Set();
    s.add(1);
    s.add(2);
    var result: any[] = [];
    s.forEach(function (v) { result.push(v); });
    expect(result.length).toBe(2);
  });

  it("passes value as both first and second arg (like native Set)", () => {
    var s = new IE6Set();
    s.add("x");
    var args: any[] = [];
    s.forEach(function (v, k) { args.push([v, k]); });
    expect(args[0][0]).toBe("x");
    expect(args[0][1]).toBe("x");
  });

  it("uses thisArg", () => {
    var s = new IE6Set();
    s.add(42);
    var ctx: any = {};
    s.forEach(function (this: any, _v) { this.called = true; }, ctx);
    expect(ctx.called).toBe(true);
  });
});

describe("IE6Set - keys/values/entries", () => {
  it("keys returns same as values (Set spec)", () => {
    var s = new IE6Set();
    s.add("a");
    s.add("b");
    expect(s.keys().sort()).toEqual(s.values().sort());
  });

  it("values returns all values", () => {
    var s = new IE6Set();
    s.add(1);
    s.add(2);
    expect(s.values().sort()).toEqual([1, 2]);
  });

  it("entries returns [value, value] pairs", () => {
    var s = new IE6Set();
    s.add("a");
    var e = s.entries();
    expect(e.length).toBe(1);
    expect(e[0][0]).toBe("a");
    expect(e[0][1]).toBe("a");
  });
});

describe("polyfillSet", () => {
  it("installs Set on window if missing", () => {
    var orig = (window as any).Set;
    delete (window as any).Set;
    polyfillSet();
    expect((window as any).Set).toBe(IE6Set);
    (window as any).Set = orig;
  });

  it("does not overwrite existing Set", () => {
    var orig = (window as any).Set;
    var fake = function () {};
    (window as any).Set = fake;
    polyfillSet();
    expect((window as any).Set).toBe(fake);
    (window as any).Set = orig;
  });
});
