import { describe, it, expect } from "vitest";

// Import the module directly to test its exports
import { polyfillArray } from "../src/array";
import { polyfillObject } from "../src/object";
import { polyfillString } from "../src/string";
import { polyfillFunction } from "../src/function";
import { polyfillJSON } from "../src/json";
import { polyfillDate } from "../src/date";
import { polyfillConsole } from "../src/console";
import { createDeferred, createMap, createSet, polyfillRequestAnimationFrame } from "../src/utils";
import { onDOMContentLoaded, querySelector, querySelectorAll, polyfillEventListener, polyfillClassList } from "../src/dom";

describe("ie6_helper integration", () => {
  it("all polyfill functions are callable", () => {
    expect(typeof polyfillArray).toBe("function");
    expect(typeof polyfillObject).toBe("function");
    expect(typeof polyfillString).toBe("function");
    expect(typeof polyfillFunction).toBe("function");
    expect(typeof polyfillJSON).toBe("function");
    expect(typeof polyfillDate).toBe("function");
    expect(typeof polyfillConsole).toBe("function");
    expect(typeof polyfillRequestAnimationFrame).toBe("function");
    expect(typeof polyfillEventListener).toBe("function");
    expect(typeof polyfillClassList).toBe("function");
  });

  it("all utility functions are callable", () => {
    expect(typeof createDeferred).toBe("function");
    expect(typeof createMap).toBe("function");
    expect(typeof createSet).toBe("function");
  });

  it("all DOM helper functions are callable", () => {
    expect(typeof onDOMContentLoaded).toBe("function");
    expect(typeof querySelector).toBe("function");
    expect(typeof querySelectorAll).toBe("function");
  });

  it("createDeferred works as expected", () => {
    const d = createDeferred<string>();
    expect(d).toBeDefined();
    expect(typeof d.resolve).toBe("function");
    expect(typeof d.reject).toBe("function");
    expect(typeof d.promise.then).toBe("function");
    d.resolve("hello");
    let result: string | undefined;
    d.promise.then((v) => { result = v; });
    expect(result).toBe("hello");
  });

  it("createMap works as expected", () => {
    const m = createMap();
    m.set("key", "value");
    expect(m.get("key")).toBe("value");
    expect(m.has("key")).toBe(true);
  });

  it("createSet works as expected", () => {
    const s = createSet();
    s.add(42);
    expect(s.has(42)).toBe(true);
    expect(s.size()).toBe(1);
  });
});
