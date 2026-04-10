import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createDeferred, createMap, createSet, polyfillRequestAnimationFrame } from "../src/utils";

describe("createDeferred", () => {
  it("resolves with value", () => {
    const d = createDeferred<string>();
    d.resolve("hello");
    let result: string | undefined;
    d.promise.then((v) => { result = v; });
    expect(result).toBe("hello");
  });

  it("rejects with reason", () => {
    const d = createDeferred<string>();
    d.reject("error");
    let reason: any;
    d.promise.then(undefined, (r) => { reason = r; });
    expect(reason).toBe("error");
  });

  it("calls then callback when already resolved", () => {
    const d = createDeferred<string>();
    d.resolve("done");
    let result: string | undefined;
    d.promise.then((v) => { result = v; });
    expect(result).toBe("done");
  });

  it("queues then callbacks before resolution", () => {
    const d = createDeferred<string>();
    const results: string[] = [];
    d.promise.then((v) => { results.push("a:" + v); });
    d.promise.then((v) => { results.push("b:" + v); });
    d.resolve("ok");
    expect(results).toEqual(["a:ok", "b:ok"]);
  });

  it("ignores subsequent resolve after first resolve", () => {
    const d = createDeferred<string>();
    d.resolve("first");
    d.resolve("second");
    let result: string | undefined;
    d.promise.then((v) => { result = v; });
    expect(result).toBe("first");
  });

  it("ignores resolve after reject", () => {
    const d = createDeferred<string>();
    d.reject("err");
    d.resolve("ok");
    let reason: any;
    d.promise.then(undefined, (r) => { reason = r; });
    expect(reason).toBe("err");
  });
});

describe("createMap", () => {
  it("get returns undefined for missing key", () => {
    const m = createMap();
    expect(m.get("x")).toBeUndefined();
  });

  it("set and get work", () => {
    const m = createMap();
    m.set("x", 42);
    expect(m.get("x")).toBe(42);
  });

  it("has returns true for existing key", () => {
    const m = createMap();
    m.set("x", 1);
    expect(m.has("x")).toBe(true);
    expect(m.has("y")).toBe(false);
  });

  it("delete removes key", () => {
    const m = createMap();
    m.set("x", 1);
    expect(m.delete("x")).toBe(true);
    expect(m.has("x")).toBe(false);
    expect(m.delete("x")).toBe(false);
  });

  it("size returns count", () => {
    const m = createMap();
    expect(m.size()).toBe(0);
    m.set("a", 1);
    m.set("b", 2);
    expect(m.size()).toBe(2);
  });

  it("keys and values return arrays", () => {
    const m = createMap();
    m.set("a", 1);
    m.set("b", 2);
    expect(m.keys().sort()).toEqual(["a", "b"]);
    expect(m.values().sort()).toEqual([1, 2]);
  });

  it("forEach iterates all entries", () => {
    const m = createMap();
    m.set("a", 1);
    m.set("b", 2);
    const result: any[] = [];
    m.forEach((v, k) => result.push([k, v]));
    expect(result.length).toBe(2);
  });

  it("overwrites existing key", () => {
    const m = createMap();
    m.set("x", 1);
    m.set("x", 2);
    expect(m.get("x")).toBe(2);
    expect(m.size()).toBe(1);
  });
});

describe("createSet", () => {
  it("add and has work", () => {
    const s = createSet();
    s.add(1);
    expect(s.has(1)).toBe(true);
    expect(s.has(2)).toBe(false);
  });

  it("duplicate add is ignored", () => {
    const s = createSet();
    s.add(1);
    s.add(1);
    expect(s.size()).toBe(1);
  });

  it("delete removes value", () => {
    const s = createSet();
    s.add(1);
    expect(s.delete(1)).toBe(true);
    expect(s.has(1)).toBe(false);
    expect(s.delete(1)).toBe(false);
  });

  it("size returns count", () => {
    const s = createSet();
    expect(s.size()).toBe(0);
    s.add(1);
    s.add(2);
    expect(s.size()).toBe(2);
  });

  it("values returns all values", () => {
    const s = createSet();
    s.add(1);
    s.add(2);
    expect(s.values().sort()).toEqual([1, 2]);
  });

  it("forEach iterates all values", () => {
    const s = createSet();
    s.add(1);
    s.add(2);
    const result: any[] = [];
    s.forEach((v) => result.push(v));
    expect(result.length).toBe(2);
  });
});

describe("polyfillRequestAnimationFrame", () => {
  let origRAF: any;
  let origCAF: any;

  beforeEach(() => {
    origRAF = (window as any).requestAnimationFrame;
    origCAF = (window as any).cancelAnimationFrame;
    delete (window as any).requestAnimationFrame;
    delete (window as any).cancelAnimationFrame;
  });

  afterEach(() => {
    (window as any).requestAnimationFrame = origRAF;
    (window as any).cancelAnimationFrame = origCAF;
  });

  it("installs requestAnimationFrame and cancelAnimationFrame", () => {
    polyfillRequestAnimationFrame();
    expect(typeof (window as any).requestAnimationFrame).toBe("function");
    expect(typeof (window as any).cancelAnimationFrame).toBe("function");
  });

  it("requestAnimationFrame returns an id (number or object)", () => {
    polyfillRequestAnimationFrame();
    const id = (window as any).requestAnimationFrame(() => {});
    expect(id).toBeDefined();
    (window as any).cancelAnimationFrame(id);
  });

  it("does not overwrite existing rAF", () => {
    const fakeRAF = () => 99;
    (window as any).requestAnimationFrame = fakeRAF;
    polyfillRequestAnimationFrame();
    expect((window as any).requestAnimationFrame).toBe(fakeRAF);
  });
});
