import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { polyfillArray } from "../src/array";

/**
 * Array polyfill tests.
 *
 * Strategy: Instead of deleting native methods from Array.prototype (which
 * corrupts vitest's internal serializer), we test the polyfill code by:
 * 1. Saving the original method
 * 2. Replacing it with undefined (to make the guard clause fire)
 * 3. Calling polyfillArray() to install our version
 * 4. Testing against the installed version
 * 5. Restoring originals in afterEach
 *
 * However, this approach can break vitest since it relies on these methods
 * internally. So we test the polyfill logic in isolation by calling the
 * polyfill functions directly on test arrays after installing, and we
 * restore originals immediately after each sub-test.
 */

// Helper: temporarily remove a method, install polyfill, run test, restore
function withPolyfill<T>(method: string, testFn: () => T): T {
  const proto = Array.prototype as any;
  const static_ = Array as any;
  const isStatic = ["isArray", "of", "from"].indexOf(method) >= 0;
  const target = isStatic ? static_ : proto;
  const original = target[method];

  delete target[method];
  polyfillArray();
  try {
    return testFn();
  } finally {
    if (original !== undefined) {
      target[method] = original;
    } else {
      delete target[method];
    }
  }
}

describe("polyfillArray", () => {
  describe("isArray", () => {
    it("returns true for arrays", () => {
      withPolyfill("isArray", () => {
        expect(Array.isArray([])).toBe(true);
        expect(Array.isArray([1, 2])).toBe(true);
      });
    });

    it("returns false for non-arrays", () => {
      withPolyfill("isArray", () => {
        expect(Array.isArray({})).toBe(false);
        expect(Array.isArray("string")).toBe(false);
        expect(Array.isArray(null)).toBe(false);
        expect(Array.isArray(undefined)).toBe(false);
        expect(Array.isArray(42)).toBe(false);
      });
    });
  });

  describe("indexOf", () => {
    it("finds existing element", () => {
      withPolyfill("indexOf", () => {
        expect([1, 2, 3].indexOf(2)).toBe(1);
      });
    });

    it("returns -1 for missing element", () => {
      withPolyfill("indexOf", () => {
        expect([1, 2, 3].indexOf(4)).toBe(-1);
      });
    });

    it("respects fromIndex", () => {
      withPolyfill("indexOf", () => {
        expect([1, 2, 3, 2].indexOf(2, 2)).toBe(3);
      });
    });

    it("handles negative fromIndex", () => {
      withPolyfill("indexOf", () => {
        expect([1, 2, 3].indexOf(1, -10)).toBe(0);
      });
    });
  });

  describe("lastIndexOf", () => {
    it("finds last occurrence", () => {
      withPolyfill("lastIndexOf", () => {
        expect([1, 2, 3, 2].lastIndexOf(2)).toBe(3);
      });
    });

    it("returns -1 for missing element", () => {
      withPolyfill("lastIndexOf", () => {
        expect([1, 2, 3].lastIndexOf(4)).toBe(-1);
      });
    });
  });

  describe("forEach", () => {
    it("iterates all elements", () => {
      withPolyfill("forEach", () => {
        const result: number[] = [];
        [1, 2, 3].forEach(n => result.push(n));
        expect(result).toEqual([1, 2, 3]);
      });
    });

    it("respects thisArg", () => {
      withPolyfill("forEach", () => {
        const ctx = { multiplier: 10 };
        const result: number[] = [];
        [1, 2].forEach(function (n) { result.push(n * this.multiplier); }, ctx);
        expect(result).toEqual([10, 20]);
      });
    });
  });

  describe("map", () => {
    it("transforms elements", () => {
      withPolyfill("map", () => {
        expect([1, 2, 3].map(n => n * 2)).toEqual([2, 4, 6]);
      });
    });
  });

  describe("filter", () => {
    it("filters elements", () => {
      withPolyfill("filter", () => {
        expect([1, 2, 3, 4].filter(n => n > 2)).toEqual([3, 4]);
      });
    });

    it("returns empty array when nothing matches", () => {
      withPolyfill("filter", () => {
        expect([1, 2, 3].filter(n => n > 10)).toEqual([]);
      });
    });
  });

  describe("every", () => {
    it("returns true when all pass", () => {
      withPolyfill("every", () => {
        expect([2, 4, 6].every(n => n % 2 === 0)).toBe(true);
      });
    });

    it("returns false when one fails", () => {
      withPolyfill("every", () => {
        expect([2, 3, 6].every(n => n % 2 === 0)).toBe(false);
      });
    });

    it("returns true for empty array", () => {
      withPolyfill("every", () => {
        expect([].every(n => false)).toBe(true);
      });
    });
  });

  describe("some", () => {
    it("returns true when one passes", () => {
      withPolyfill("some", () => {
        expect([1, 4, 5].some(n => n % 2 === 0)).toBe(true);
      });
    });

    it("returns false when none pass", () => {
      withPolyfill("some", () => {
        expect([1, 3, 5].some(n => n % 2 === 0)).toBe(false);
      });
    });

    it("returns false for empty array", () => {
      withPolyfill("some", () => {
        expect([].some(n => true)).toBe(false);
      });
    });
  });

  describe("reduce", () => {
    it("sums values with initial value", () => {
      withPolyfill("reduce", () => {
        expect([1, 2, 3].reduce((a, b) => a + b, 0)).toBe(6);
      });
    });

    it("uses first element as initial when no initial value", () => {
      withPolyfill("reduce", () => {
        expect([1, 2, 3].reduce((a, b) => a + b)).toBe(6);
      });
    });

    it("throws on empty array with no initial value", () => {
      withPolyfill("reduce", () => {
        expect(() => [].reduce((a, b) => a + b)).toThrow(TypeError);
      });
    });
  });

  describe("reduceRight", () => {
    it("reduces right-to-left", () => {
      withPolyfill("reduceRight", () => {
        // reduceRight on [1,2,3]: start with 3, then fn(3,2)=1, then fn(1,1)=0
        expect([1, 2, 3].reduceRight((a, b) => a - b)).toBe(0);
      });
    });
  });

  describe("find", () => {
    it("returns first matching element", () => {
      withPolyfill("find", () => {
        expect([1, 2, 3, 4].find(n => n > 2)).toBe(3);
      });
    });

    it("returns undefined when nothing matches", () => {
      withPolyfill("find", () => {
        expect([1, 2, 3].find(n => n > 10)).toBeUndefined();
      });
    });
  });

  describe("findIndex", () => {
    it("returns index of first matching element", () => {
      withPolyfill("findIndex", () => {
        expect([1, 2, 3, 4].findIndex(n => n > 2)).toBe(2);
      });
    });

    it("returns -1 when nothing matches", () => {
      withPolyfill("findIndex", () => {
        expect([1, 2, 3].findIndex(n => n > 10)).toBe(-1);
      });
    });
  });

  describe("fill", () => {
    it("fills entire array", () => {
      withPolyfill("fill", () => {
        expect([1, 2, 3].fill(0)).toEqual([0, 0, 0]);
      });
    });

    it("fills with start and end", () => {
      withPolyfill("fill", () => {
        expect([1, 2, 3, 4].fill(0, 1, 3)).toEqual([1, 0, 0, 4]);
      });
    });

    it("handles negative indices", () => {
      withPolyfill("fill", () => {
        expect([1, 2, 3, 4].fill(0, -2)).toEqual([1, 2, 0, 0]);
      });
    });
  });

  describe("Array.of", () => {
    it("creates array from arguments", () => {
      withPolyfill("of", () => {
        expect(Array.of(1, 2, 3)).toEqual([1, 2, 3]);
      });
    });

    it("creates empty array with no arguments", () => {
      withPolyfill("of", () => {
        expect(Array.of()).toEqual([]);
      });
    });
  });

  describe("Array.from", () => {
    it("creates array from string", () => {
      withPolyfill("from", () => {
        expect(Array.from("abc")).toEqual(["a", "b", "c"]);
      });
    });

    it("creates array with mapFn", () => {
      withPolyfill("from", () => {
        expect(Array.from("123", Number)).toEqual([1, 2, 3]);
      });
    });
  });

  it("does not overwrite existing methods", () => {
    const fakeMap = () => "fake";
    const original = (Array.prototype as any).map;
    (Array.prototype as any).map = fakeMap;
    polyfillArray();
    expect((Array.prototype as any).map).toBe(fakeMap);
    (Array.prototype as any).map = original;
  });
});
