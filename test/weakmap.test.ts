import { describe, it, expect } from "vitest";
import { polyfillWeakMap, IE6WeakMap } from "../src/weakmap";

describe("IE6WeakMap - basic", () => {
  it("creates empty weakmap", () => {
    var wm = new IE6WeakMap();
    expect(wm).toBeDefined();
  });

  it("creates weakmap from array of entries", () => {
    var key1 = {};
    var key2 = {};
    var wm = new IE6WeakMap([[key1, "a"], [key2, "b"]]);
    expect(wm.get(key1)).toBe("a");
    expect(wm.get(key2)).toBe("b");
  });
});

describe("IE6WeakMap - get/set/has", () => {
  it("get returns undefined for missing key", () => {
    var wm = new IE6WeakMap();
    expect(wm.get({})).toBeUndefined();
  });

  it("get returns undefined for non-object key", () => {
    var wm = new IE6WeakMap();
    expect(wm.get("string")).toBeUndefined();
    expect(wm.get(42)).toBeUndefined();
  });

  it("set and get work with object keys", () => {
    var wm = new IE6WeakMap();
    var key = {};
    wm.set(key, "value");
    expect(wm.get(key)).toBe("value");
  });

  it("set returns the weakmap for chaining", () => {
    var wm = new IE6WeakMap();
    var key = {};
    var result = wm.set(key, 1);
    expect(result).toBe(wm);
  });

  it("has returns true for existing key", () => {
    var wm = new IE6WeakMap();
    var key = {};
    wm.set(key, 1);
    expect(wm.has(key)).toBe(true);
    expect(wm.has({})).toBe(false);
  });

  it("has returns false for non-object key", () => {
    var wm = new IE6WeakMap();
    expect(wm.has("str")).toBe(false);
  });

  it("overwrites existing key", () => {
    var wm = new IE6WeakMap();
    var key = {};
    wm.set(key, 1);
    wm.set(key, 2);
    expect(wm.get(key)).toBe(2);
  });

  it("supports function keys", () => {
    var wm = new IE6WeakMap();
    var key = function () {};
    wm.set(key, "fn-value");
    expect(wm.get(key)).toBe("fn-value");
  });

  it("different weakmaps are isolated", () => {
    var wm1 = new IE6WeakMap();
    var wm2 = new IE6WeakMap();
    var key = {};
    wm1.set(key, "a");
    wm2.set(key, "b");
    expect(wm1.get(key)).toBe("a");
    expect(wm2.get(key)).toBe("b");
  });
});

describe("IE6WeakMap - delete", () => {
  it("deletes existing key and returns true", () => {
    var wm = new IE6WeakMap();
    var key = {};
    wm.set(key, 1);
    expect(wm.delete(key)).toBe(true);
    expect(wm.has(key)).toBe(false);
    expect(wm.get(key)).toBeUndefined();
  });

  it("returns false for missing key", () => {
    var wm = new IE6WeakMap();
    expect(wm.delete({})).toBe(false);
  });

  it("returns false for non-object key", () => {
    var wm = new IE6WeakMap();
    expect(wm.delete("str")).toBe(false);
  });
});

describe("IE6WeakMap - set throws for non-object keys", () => {
  it("throws TypeError for string key", () => {
    var wm = new IE6WeakMap();
    expect(function () { wm.set("key", 1); }).toThrow(TypeError);
  });

  it("throws TypeError for number key", () => {
    var wm = new IE6WeakMap();
    expect(function () { wm.set(42, 1); }).toThrow(TypeError);
  });

  it("throws TypeError for null key", () => {
    var wm = new IE6WeakMap();
    expect(function () { wm.set(null, 1); }).toThrow(TypeError);
  });

  it("throws TypeError for undefined key", () => {
    var wm = new IE6WeakMap();
    expect(function () { wm.set(undefined, 1); }).toThrow(TypeError);
  });
});

describe("polyfillWeakMap", () => {
  it("installs WeakMap on window if missing", () => {
    var orig = (window as any).WeakMap;
    delete (window as any).WeakMap;
    polyfillWeakMap();
    expect((window as any).WeakMap).toBe(IE6WeakMap);
    (window as any).WeakMap = orig;
  });

  it("does not overwrite existing WeakMap", () => {
    var orig = (window as any).WeakMap;
    var fake = function () {};
    (window as any).WeakMap = fake;
    polyfillWeakMap();
    expect((window as any).WeakMap).toBe(fake);
    (window as any).WeakMap = orig;
  });
});
