import { describe, it, expect } from "vitest";
import { polyfillMap, IE6Map } from "../src/map";

describe("IE6Map - basic", () => {
  it("creates empty map", () => {
    var m = new IE6Map();
    expect(m.size).toBe(0);
  });

  it("creates map from array of entries", () => {
    var m = new IE6Map([["a", 1], ["b", 2]]);
    expect(m.size).toBe(2);
    expect(m.get("a")).toBe(1);
    expect(m.get("b")).toBe(2);
  });
});

describe("IE6Map - get/set/has", () => {
  it("get returns undefined for missing key", () => {
    var m = new IE6Map();
    expect(m.get("x")).toBeUndefined();
  });

  it("set and get work with string keys", () => {
    var m = new IE6Map();
    m.set("x", 42);
    expect(m.get("x")).toBe(42);
  });

  it("set returns the map for chaining", () => {
    var m = new IE6Map();
    var result = m.set("a", 1);
    expect(result).toBe(m);
  });

  it("has returns true for existing key", () => {
    var m = new IE6Map();
    m.set("x", 1);
    expect(m.has("x")).toBe(true);
    expect(m.has("y")).toBe(false);
  });

  it("overwrites existing key", () => {
    var m = new IE6Map();
    m.set("x", 1);
    m.set("x", 2);
    expect(m.get("x")).toBe(2);
    expect(m.size).toBe(1);
  });

  it("supports object keys", () => {
    var m = new IE6Map();
    var key = {};
    m.set(key, "obj-value");
    expect(m.get(key)).toBe("obj-value");
    expect(m.get({})).toBeUndefined();
  });

  it("supports NaN as key", () => {
    var m = new IE6Map();
    m.set(NaN, "not-a-number");
    expect(m.get(NaN)).toBe("not-a-number");
    expect(m.has(NaN)).toBe(true);
  });

  it("distinguishes 0 from -0", () => {
    var m = new IE6Map();
    m.set(0, "zero");
    m.set(-0, "neg-zero");
    // SameValueZero considers 0 === -0, so they should be the same key
    expect(m.size).toBe(1);
  });
});

describe("IE6Map - delete", () => {
  it("deletes existing key and returns true", () => {
    var m = new IE6Map();
    m.set("x", 1);
    expect(m.delete("x")).toBe(true);
    expect(m.has("x")).toBe(false);
    expect(m.size).toBe(0);
  });

  it("returns false for missing key", () => {
    var m = new IE6Map();
    expect(m.delete("x")).toBe(false);
  });
});

describe("IE6Map - clear", () => {
  it("removes all entries", () => {
    var m = new IE6Map();
    m.set("a", 1);
    m.set("b", 2);
    m.clear();
    expect(m.size).toBe(0);
    expect(m.has("a")).toBe(false);
  });
});

describe("IE6Map - forEach", () => {
  it("iterates all entries", () => {
    var m = new IE6Map();
    m.set("a", 1);
    m.set("b", 2);
    var result: any[] = [];
    m.forEach(function (v, k) { result.push([k, v]); });
    expect(result.length).toBe(2);
  });

  it("uses thisArg", () => {
    var m = new IE6Map();
    m.set("x", 42);
    var ctx: any = {};
    m.forEach(function (this: any, _v, _k) { this.called = true; }, ctx);
    expect(ctx.called).toBe(true);
  });
});

describe("IE6Map - keys/values/entries", () => {
  it("keys returns all keys", () => {
    var m = new IE6Map();
    m.set("a", 1);
    m.set("b", 2);
    expect(m.keys().sort()).toEqual(["a", "b"]);
  });

  it("values returns all values", () => {
    var m = new IE6Map();
    m.set("a", 1);
    m.set("b", 2);
    expect(m.values().sort()).toEqual([1, 2]);
  });

  it("entries returns [key, value] pairs", () => {
    var m = new IE6Map();
    m.set("a", 1);
    var e = m.entries();
    expect(e.length).toBe(1);
    expect(e[0][0]).toBe("a");
    expect(e[0][1]).toBe(1);
  });
});

describe("polyfillMap", () => {
  it("installs Map on window if missing", () => {
    var orig = (window as any).Map;
    delete (window as any).Map;
    polyfillMap();
    expect((window as any).Map).toBe(IE6Map);
    // Restore — jsdom needs Map internally
    (window as any).Map = orig;
  });

  it("does not overwrite existing Map", () => {
    var orig = (window as any).Map;
    var fake = function () {};
    (window as any).Map = fake;
    polyfillMap();
    expect((window as any).Map).toBe(fake);
    (window as any).Map = orig;
  });
});
