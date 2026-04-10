import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { polyfillJSON } from "../src/json";

describe("polyfillJSON", () => {
  let origJSON: any;

  beforeEach(() => {
    origJSON = (window as any).JSON;
    delete (window as any).JSON;
  });

  afterEach(() => {
    (window as any).JSON = origJSON;
  });

  describe("stringify", () => {
    it("stringifies primitives", () => {
      polyfillJSON();
      expect(JSON.stringify(42)).toBe("42");
      expect(JSON.stringify("hello")).toBe("\"hello\"");
      expect(JSON.stringify(true)).toBe("true");
      expect(JSON.stringify(null)).toBe("null");
    });

    it("stringifies arrays", () => {
      polyfillJSON();
      expect(JSON.stringify([1, 2, 3])).toBe("[1,2,3]");
    });

    it("stringifies objects", () => {
      polyfillJSON();
      const result = JSON.stringify({ a: 1 });
      expect(result).toContain("\"a\"");
      expect(result).toContain("1");
    });

    it("omits undefined values from objects", () => {
      polyfillJSON();
      expect(JSON.stringify({ a: undefined })).toBe("{}");
    });

    it("stringifies nested structures", () => {
      polyfillJSON();
      const result = JSON.stringify({ a: { b: 1 } });
      expect(JSON.parse(result)).toEqual({ a: { b: 1 } });
    });

    it("uses toJSON method when available", () => {
      polyfillJSON();
      const obj = {
        x: 42,
        toJSON: function() { return { y: 99 }; }
      };
      expect(JSON.parse(JSON.stringify(obj))).toEqual({ y: 99 });
    });

    it("supports function replacer", () => {
      polyfillJSON();
      const result = JSON.stringify({ a: 1, b: 2 }, function(key: string, value: any) {
        return typeof value === "number" ? value * 2 : value;
      });
      expect(JSON.parse(result)).toEqual({ a: 2, b: 4 });
    });

    it("supports array replacer", () => {
      polyfillJSON();
      const result = JSON.stringify({ a: 1, b: 2, c: 3 }, ["a", "c"]);
      expect(JSON.parse(result)).toEqual({ a: 1, c: 3 });
    });

    it("supports space parameter for formatting", () => {
      polyfillJSON();
      const result = JSON.stringify({ a: 1 }, null, 2);
      expect(result).toContain("\n");
    });
  });

  describe("parse", () => {
    it("parses primitives", () => {
      polyfillJSON();
      expect(JSON.parse("42")).toBe(42);
      expect(JSON.parse("\"hello\"")).toBe("hello");
      expect(JSON.parse("true")).toBe(true);
      expect(JSON.parse("null")).toBeNull();
    });

    it("parses arrays", () => {
      polyfillJSON();
      expect(JSON.parse("[1,2,3]")).toEqual([1, 2, 3]);
    });

    it("parses objects", () => {
      polyfillJSON();
      expect(JSON.parse("{\"a\":1}")).toEqual({ a: 1 });
    });

    it("parses nested structures", () => {
      polyfillJSON();
      expect(JSON.parse("{\"a\":{\"b\":2}}")).toEqual({ a: { b: 2 } });
    });

    it("supports reviver function", () => {
      polyfillJSON();
      const result = JSON.parse("{\"a\":\"1\",\"b\":\"2\"}", function(key: string, value: any) {
        return typeof value === "string" && !isNaN(Number(value)) ? Number(value) : value;
      });
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it("throws SyntaxError on invalid JSON", () => {
      polyfillJSON();
      expect(() => JSON.parse("{invalid}")).toThrow(SyntaxError);
    });
  });

  it("roundtrip preserves data", () => {
    polyfillJSON();
    const original = { name: "test", values: [1, 2, 3], nested: { x: true } };
    expect(JSON.parse(JSON.stringify(original))).toEqual(original);
  });

  it("does not overwrite existing JSON", () => {
    const fakeJSON = { stringify: () => "fake", parse: () => "fake" };
    (window as any).JSON = fakeJSON;
    polyfillJSON();
    expect((window as any).JSON).toBe(fakeJSON);
  });
});
