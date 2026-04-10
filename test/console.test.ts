import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { polyfillConsole } from "../src/console";

describe("polyfillConsole", () => {
  let originalConsole: any;

  beforeEach(() => {
    originalConsole = (window as any).console;
    delete (window as any).console;
  });

  afterEach(() => {
    (window as any).console = originalConsole;
  });

  it("creates a console object with all standard methods", () => {
    polyfillConsole();
    const c = (window as any).console;
    expect(c).toBeDefined();
    expect(typeof c.log).toBe("function");
    expect(typeof c.warn).toBe("function");
    expect(typeof c.error).toBe("function");
    expect(typeof c.info).toBe("function");
    expect(typeof c.debug).toBe("function");
    expect(typeof c.dir).toBe("function");
    expect(typeof c.trace).toBe("function");
    expect(typeof c.assert).toBe("function");
    expect(typeof c.count).toBe("function");
    expect(typeof c.time).toBe("function");
    expect(typeof c.timeEnd).toBe("function");
    expect(typeof c.group).toBe("function");
    expect(typeof c.groupEnd).toBe("function");
  });

  it("all methods are no-ops that don't throw", () => {
    polyfillConsole();
    const c = (window as any).console;
    expect(() => c.log("test")).not.toThrow();
    expect(() => c.warn("test")).not.toThrow();
    expect(() => c.error("test")).not.toThrow();
    expect(() => c.info("test")).not.toThrow();
    expect(() => c.debug("test")).not.toThrow();
    expect(() => c.dir({})).not.toThrow();
    expect(() => c.trace()).not.toThrow();
    expect(() => c.assert(true)).not.toThrow();
    expect(() => c.count("x")).not.toThrow();
    expect(() => c.time("x")).not.toThrow();
    expect(() => c.timeEnd("x")).not.toThrow();
    expect(() => c.group("x")).not.toThrow();
    expect(() => c.groupEnd()).not.toThrow();
  });

  it("does not overwrite an existing console", () => {
    const fakeConsole = { log: () => "fake" };
    (window as any).console = fakeConsole;
    polyfillConsole();
    expect((window as any).console).toBe(fakeConsole);
  });
});
