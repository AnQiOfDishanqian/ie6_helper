import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { polyfillString } from "../src/string";

describe("polyfillString", () => {
  let originals: Record<string, any> = {};

  const methods = [
    "trim", "startsWith", "endsWith", "includes",
    "repeat", "padStart", "padEnd"
  ];

  beforeEach(() => {
    methods.forEach(m => {
      originals[m] = String.prototype[m as any];
      delete (String.prototype as any)[m];
    });
    originals["raw"] = (String as any).raw;
    delete (String as any).raw;
  });

  afterEach(() => {
    methods.forEach(m => {
      if (originals[m] !== undefined) {
        (String.prototype as any)[m] = originals[m];
      } else {
        delete (String.prototype as any)[m];
      }
    });
    if (originals["raw"] !== undefined) {
      (String as any).raw = originals["raw"];
    } else {
      delete (String as any).raw;
    }
  });

  describe("trim", () => {
    it("removes leading and trailing whitespace", () => {
      polyfillString();
      expect("  hello  ".trim()).toBe("hello");
    });

    it("removes tabs and newlines", () => {
      polyfillString();
      expect("\t\nhello\n\t".trim()).toBe("hello");
    });

    it("no-op on clean string", () => {
      polyfillString();
      expect("hello".trim()).toBe("hello");
    });
  });

  describe("startsWith", () => {
    it("returns true when string starts with search", () => {
      polyfillString();
      expect("hello world".startsWith("hello")).toBe(true);
    });

    it("returns false when string does not start with search", () => {
      polyfillString();
      expect("hello world".startsWith("world")).toBe(false);
    });

    it("respects position parameter", () => {
      polyfillString();
      expect("hello world".startsWith("world", 6)).toBe(true);
    });
  });

  describe("endsWith", () => {
    it("returns true when string ends with search", () => {
      polyfillString();
      expect("hello world".endsWith("world")).toBe(true);
    });

    it("returns false when string does not end with search", () => {
      polyfillString();
      expect("hello world".endsWith("hello")).toBe(false);
    });

    it("respects endPosition parameter", () => {
      polyfillString();
      expect("hello world".endsWith("hello", 5)).toBe(true);
    });
  });

  describe("includes", () => {
    it("returns true when string contains search", () => {
      polyfillString();
      expect("hello world".includes("o w")).toBe(true);
    });

    it("returns false when string does not contain search", () => {
      polyfillString();
      expect("hello world".includes("xyz")).toBe(false);
    });

    it("respects position parameter", () => {
      polyfillString();
      expect("hello world".includes("world", 6)).toBe(true);
    });
  });

  describe("repeat", () => {
    it("repeats string 3 times", () => {
      polyfillString();
      expect("ab".repeat(3)).toBe("ababab");
    });

    it("returns empty string for 0 count", () => {
      polyfillString();
      expect("ab".repeat(0)).toBe("");
    });

    it("throws for negative count", () => {
      polyfillString();
      expect(() => "ab".repeat(-1)).toThrow(RangeError);
    });

    it("throws for Infinity count", () => {
      polyfillString();
      expect(() => "ab".repeat(Infinity)).toThrow(RangeError);
    });
  });

  describe("padStart", () => {
    it("pads string to target length", () => {
      polyfillString();
      expect("5".padStart(3, "0")).toBe("005");
    });

    it("no-op if already long enough", () => {
      polyfillString();
      expect("hello".padStart(3)).toBe("hello");
    });

    it("uses space as default fill", () => {
      polyfillString();
      expect("hi".padStart(5)).toBe("   hi");
    });
  });

  describe("padEnd", () => {
    it("pads string to target length", () => {
      polyfillString();
      expect("5".padEnd(3, "0")).toBe("500");
    });

    it("no-op if already long enough", () => {
      polyfillString();
      expect("hello".padEnd(3)).toBe("hello");
    });

    it("uses space as default fill", () => {
      polyfillString();
      expect("hi".padEnd(5)).toBe("hi   ");
    });
  });

  describe("String.raw", () => {
    it("joins raw strings with substitutions", () => {
      polyfillString();
      const result = (String as any).raw({ raw: ["a", "b", "c"] }, "X", "Y");
      expect(result).toBe("aXbYc");
    });
  });

  it("does not overwrite existing methods", () => {
    const fakeTrim = () => "fake";
    (String.prototype as any).trim = fakeTrim;
    polyfillString();
    expect((String.prototype as any).trim).toBe(fakeTrim);
  });
});
