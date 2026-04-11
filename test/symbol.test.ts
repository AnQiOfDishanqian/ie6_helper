import { describe, it, expect } from "vitest";
import { polyfillSymbol, IE6Symbol } from "../src/symbol";

describe("IE6Symbol - basic", () => {
  it("creates a unique symbol", () => {
    var s1 = IE6Symbol();
    var s2 = IE6Symbol();
    expect(s1).not.toBe(s2);
  });

  it("creates a symbol with description", () => {
    var s = IE6Symbol("foo");
    expect(typeof s).toBe("string");
  });

  it("throws when called with new", () => {
    expect(function () { new (IE6Symbol as any)(); }).toThrow(TypeError);
  });

  it("symbols are unique strings", () => {
    var s1 = IE6Symbol("desc");
    var s2 = IE6Symbol("desc");
    expect(s1).not.toBe(s2);
  });
});

describe("IE6Symbol - for / keyFor", () => {
  it("Symbol.for returns same symbol for same key", () => {
    var s1 = IE6Symbol.for("app.key");
    var s2 = IE6Symbol.for("app.key");
    expect(s1).toBe(s2);
  });

  it("Symbol.for returns different symbols for different keys", () => {
    var s1 = IE6Symbol.for("key1");
    var s2 = IE6Symbol.for("key2");
    expect(s1).not.toBe(s2);
  });

  it("Symbol.keyFor returns the key for a registered symbol", () => {
    var s = IE6Symbol.for("mykey");
    expect(IE6Symbol.keyFor(s)).toBe("mykey");
  });

  it("Symbol.keyFor returns undefined for unregistered symbol", () => {
    var s = IE6Symbol("local");
    expect(IE6Symbol.keyFor(s)).toBeUndefined();
  });
});

describe("IE6Symbol - well-known symbols", () => {
  it("Symbol.iterator is defined", () => {
    expect(IE6Symbol.iterator).toBeDefined();
    expect(typeof IE6Symbol.iterator).toBe("string");
  });

  it("Symbol.toStringTag is defined", () => {
    expect(IE6Symbol.toStringTag).toBeDefined();
  });

  it("Symbol.hasInstance is defined", () => {
    expect(IE6Symbol.hasInstance).toBeDefined();
  });

  it("Symbol.species is defined", () => {
    expect(IE6Symbol.species).toBeDefined();
  });

  it("well-known symbols are consistent", () => {
    var a = IE6Symbol.iterator;
    var b = IE6Symbol.iterator;
    expect(a).toBe(b);
  });

  it("well-known symbols are different from each other", () => {
    expect(IE6Symbol.iterator).not.toBe(IE6Symbol.toStringTag);
    expect(IE6Symbol.hasInstance).not.toBe(IE6Symbol.species);
  });
});

describe("IE6Symbol - as property key", () => {
  it("can be used as an object property key", () => {
    var sym = IE6Symbol("mykey");
    var obj: any = {};
    obj[sym] = 42;
    expect(obj[sym]).toBe(42);
  });

  it("different symbols produce different properties", () => {
    var s1 = IE6Symbol("key");
    var s2 = IE6Symbol("key");
    var obj: any = {};
    obj[s1] = "a";
    obj[s2] = "b";
    expect(obj[s1]).toBe("a");
    expect(obj[s2]).toBe("b");
  });
});

describe("IE6Symbol._isSymbol", () => {
  it("identifies polyfill symbols", () => {
    var s = IE6Symbol("test");
    expect(IE6Symbol._isSymbol(s)).toBe(true);
  });

  it("returns false for regular strings", () => {
    expect(IE6Symbol._isSymbol("hello")).toBe(false);
    expect(IE6Symbol._isSymbol("")).toBe(false);
  });

  it("returns false for non-strings", () => {
    expect(IE6Symbol._isSymbol(42)).toBe(false);
    expect(IE6Symbol._isSymbol(null)).toBe(false);
    expect(IE6Symbol._isSymbol(undefined)).toBe(false);
  });
});

describe("polyfillSymbol", () => {
  it("installs Symbol on window if missing", () => {
    var orig = (window as any).Symbol;
    delete (window as any).Symbol;
    polyfillSymbol();
    expect((window as any).Symbol).toBe(IE6Symbol);
    (window as any).Symbol = orig;
  });

  it("does not overwrite existing Symbol", () => {
    var orig = (window as any).Symbol;
    var fake = function () {};
    (window as any).Symbol = fake;
    polyfillSymbol();
    expect((window as any).Symbol).toBe(fake);
    (window as any).Symbol = orig;
  });
});
