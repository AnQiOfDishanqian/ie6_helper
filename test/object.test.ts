import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { polyfillObject } from "../src/object";

describe("polyfillObject", () => {
  let originals: Record<string, any> = {};

  const staticMethods = [
    "keys", "create", "getPrototypeOf", "defineProperty",
    "defineProperties", "getOwnPropertyDescriptor",
    "is", "assign", "freeze", "seal", "preventExtensions",
    "isFrozen", "isSealed", "isExtensible", "values", "entries"
  ];

  beforeEach(() => {
    staticMethods.forEach(m => {
      originals[m] = (Object as any)[m];
      delete (Object as any)[m];
    });
  });

  afterEach(() => {
    staticMethods.forEach(m => {
      if (originals[m] !== undefined) {
        (Object as any)[m] = originals[m];
      } else {
        delete (Object as any)[m];
      }
    });
  });

  describe("keys", () => {
    it("returns own enumerable keys", () => {
      polyfillObject();
      expect(Object.keys({ a: 1, b: 2 }).sort()).toEqual(["a", "b"]);
    });

    it("includes don't-enum-bug keys like toString", () => {
      polyfillObject();
      const obj = { a: 1, toString: function() {} };
      const keys = Object.keys(obj);
      expect(keys).toContain("toString");
      expect(keys).toContain("a");
    });
  });

  describe("create", () => {
    it("creates object with given prototype", () => {
      polyfillObject();
      const proto = { greet: function() { return "hi"; } };
      const obj = Object.create(proto);
      expect(obj.greet()).toBe("hi");
    });

    it("creates object with null prototype", () => {
      polyfillObject();
      const obj = Object.create(null);
      expect(Object.prototype.toString.call(obj)).toBe("[object Object]");
    });

    it("applies propertiesObject", () => {
      polyfillObject();
      const obj = Object.create(Object.prototype, {
        x: { value: 42, writable: true, enumerable: true, configurable: true }
      });
      expect((obj as any).x).toBe(42);
    });
  });

  describe("getPrototypeOf", () => {
    it("returns prototype of an object", () => {
      polyfillObject();
      function Foo() {}
      const obj = new (Foo as any)();
      expect(Object.getPrototypeOf(obj)).toBe(Foo.prototype);
    });

    it("works with Object.create result", () => {
      polyfillObject();
      const proto = { x: 1 };
      const obj = Object.create(proto);
      expect(Object.getPrototypeOf(obj)).toBe(proto);
    });
  });

  describe("defineProperty", () => {
    it("sets value on object", () => {
      polyfillObject();
      const obj: any = {};
      Object.defineProperty(obj, "x", { value: 42 });
      expect(obj.x).toBe(42);
    });

    it("silently ignores get/set (IE6 limitation)", () => {
      polyfillObject();
      const obj: any = {};
      Object.defineProperty(obj, "x", {
        get: function() { return 99; }
      });
      // In IE6 mode, getter is ignored, value is undefined
      expect(obj.x).toBeUndefined();
    });
  });

  describe("defineProperties", () => {
    it("sets multiple properties", () => {
      polyfillObject();
      const obj: any = {};
      Object.defineProperties(obj, {
        a: { value: 1 },
        b: { value: 2 }
      });
      expect(obj.a).toBe(1);
      expect(obj.b).toBe(2);
    });
  });

  describe("getOwnPropertyDescriptor", () => {
    it("returns descriptor for own property", () => {
      polyfillObject();
      const obj = { x: 42 };
      const desc = Object.getOwnPropertyDescriptor(obj, "x") as any;
      expect(desc.value).toBe(42);
      expect(desc.writable).toBe(true);
    });

    it("returns undefined for missing property", () => {
      polyfillObject();
      expect(Object.getOwnPropertyDescriptor({}, "x")).toBeUndefined();
    });
  });

  describe("is", () => {
    it("distinguishes 0 from -0", () => {
      polyfillObject();
      expect(Object.is(0, -0)).toBe(false);
    });

    it("NaN equals NaN", () => {
      polyfillObject();
      expect(Object.is(NaN, NaN)).toBe(true);
    });

    it("same values are equal", () => {
      polyfillObject();
      expect(Object.is(42, 42)).toBe(true);
      expect(Object.is("abc", "abc")).toBe(true);
    });
  });

  describe("assign", () => {
    it("merges objects", () => {
      polyfillObject();
      const result = Object.assign({ a: 1 }, { b: 2 }, { c: 3 }) as any;
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it("later sources overwrite earlier", () => {
      polyfillObject();
      const result = Object.assign({ a: 1 }, { a: 2 }) as any;
      expect(result.a).toBe(2);
    });

    it("skips null/undefined sources", () => {
      polyfillObject();
      const result = Object.assign({ a: 1 }, null, undefined) as any;
      expect(result).toEqual({ a: 1 });
    });

    it("throws on null target", () => {
      polyfillObject();
      expect(() => Object.assign(null as any, {})).toThrow(TypeError);
    });
  });

  describe("freeze", () => {
    it("returns the same object (best-effort no-op)", () => {
      polyfillObject();
      const obj = { x: 1 };
      expect(Object.freeze(obj)).toBe(obj);
    });
  });

  describe("seal", () => {
    it("returns the same object (best-effort no-op)", () => {
      polyfillObject();
      const obj = { x: 1 };
      expect(Object.seal(obj)).toBe(obj);
    });
  });

  describe("preventExtensions", () => {
    it("returns the same object (best-effort no-op)", () => {
      polyfillObject();
      const obj = { x: 1 };
      expect(Object.preventExtensions(obj)).toBe(obj);
    });
  });

  describe("isFrozen", () => {
    it("returns false (best-effort)", () => {
      polyfillObject();
      expect(Object.isFrozen({})).toBe(false);
    });
  });

  describe("isSealed", () => {
    it("returns false (best-effort)", () => {
      polyfillObject();
      expect(Object.isSealed({})).toBe(false);
    });
  });

  describe("isExtensible", () => {
    it("returns true (best-effort)", () => {
      polyfillObject();
      expect(Object.isExtensible({})).toBe(true);
    });
  });

  describe("values", () => {
    it("returns values of object", () => {
      polyfillObject();
      expect((Object as any).values({ a: 1, b: 2 }).sort()).toEqual([1, 2]);
    });
  });

  describe("entries", () => {
    it("returns [key, value] pairs", () => {
      polyfillObject();
      const result = (Object as any).entries({ a: 1, b: 2 });
      expect(result.length).toBe(2);
      expect(result).toContainEqual(["a", 1]);
      expect(result).toContainEqual(["b", 2]);
    });
  });

  it("does not overwrite existing methods", () => {
    const fakeKeys = () => ["fake"];
    (Object as any).keys = fakeKeys;
    polyfillObject();
    expect((Object as any).keys).toBe(fakeKeys);
  });
});
