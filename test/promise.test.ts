import { describe, it, expect } from "vitest";
import { polyfillPromise, IE6Promise } from "../src/promise";

describe("IE6Promise - basic", () => {
  it("resolves with a value", () => {
    var result: string | undefined;
    var p = new IE6Promise<string>(function (resolve) {
      resolve("hello");
    });
    p.then(function (v) { result = v; });
    expect(result).toBe("hello");
  });

  it("rejects with a reason", () => {
    var reason: any;
    var p = new IE6Promise(function (_resolve, reject) {
      reject("error");
    });
    p.then(undefined, function (r) { reason = r; });
    expect(reason).toBe("error");
  });

  it("resolves via then chaining", () => {
    var result: number | undefined;
    var p = new IE6Promise<number>(function (resolve) {
      resolve(42);
    });
    p.then(function (v) { return v + 1; }).then(function (v) { result = v; });
    expect(result).toBe(43);
  });

  it("catches errors in executor", () => {
    var reason: any;
    var p = new IE6Promise(function () {
      throw new Error("boom");
    });
    p.then(undefined, function (r) { reason = r; });
    expect(reason).toBeInstanceOf(Error);
    expect(reason.message).toBe("boom");
  });

  it("rejects if resolved with itself", () => {
    // In our synchronous polyfill, the executor runs before the variable
    // is assigned, so we need to use a deferred pattern
    var deferred: { resolve: Function } = { resolve: function () {} };
    var p = new IE6Promise(function (resolve) {
      deferred.resolve = resolve;
    });
    // Now p is assigned, resolve with itself
    var reason: any;
    p.then(undefined, function (r) { reason = r; });
    deferred.resolve(p);
    expect(reason).toBeInstanceOf(TypeError);
  });
});

describe("IE6Promise - then", () => {
  it("passes value through when onFulfilled is null", () => {
    var result: any;
    IE6Promise.resolve(42)
      .then(undefined)
      .then(function (v) { result = v; });
    expect(result).toBe(42);
  });

  it("passes reason through when onRejected is null", () => {
    var reason: any;
    IE6Promise.reject("err")
      .then(undefined, undefined)
      .then(undefined, function (r) { reason = r; });
    expect(reason).toBe("err");
  });

  it("chains thenable return values", () => {
    var result: number | undefined;
    IE6Promise.resolve(1)
      .then(function (v) {
        return IE6Promise.resolve(v + 10);
      })
      .then(function (v) { result = v; });
    expect(result).toBe(11);
  });

  it("chains rejected thenable return values", () => {
    var reason: any;
    IE6Promise.resolve(1)
      .then(function () {
        return IE6Promise.reject("bad");
      })
      .then(undefined, function (r) { reason = r; });
    expect(reason).toBe("bad");
  });

  it("catches thrown errors in onFulfilled", () => {
    var reason: any;
    IE6Promise.resolve(1)
      .then(function () {
        throw new Error("oops");
      })
      .then(undefined, function (r) { reason = r; });
    expect(reason.message).toBe("oops");
  });
});

describe("IE6Promise - catch", () => {
  it("catches rejection", () => {
    var reason: any;
    IE6Promise.reject("fail").catch(function (r) { reason = r; });
    expect(reason).toBe("fail");
  });

  it("does not trigger for resolved promises", () => {
    var called = false;
    IE6Promise.resolve("ok").catch(function () { called = true; });
    expect(called).toBe(false);
  });

  it("recovers from catch", () => {
    var result: string | undefined;
    IE6Promise.reject("fail")
      .catch(function () { return "recovered"; })
      .then(function (v) { result = v; });
    expect(result).toBe("recovered");
  });
});

describe("IE6Promise - finally", () => {
  it("calls callback on resolve", () => {
    var called = false;
    var result: string | undefined;
    IE6Promise.resolve("ok")
      .finally(function () { called = true; })
      .then(function (v) { result = v; });
    expect(called).toBe(true);
    expect(result).toBe("ok");
  });

  it("calls callback on reject", () => {
    var called = false;
    var reason: any;
    IE6Promise.reject("fail")
      .finally(function () { called = true; })
      .then(undefined, function (r) { reason = r; });
    expect(called).toBe(true);
    expect(reason).toBe("fail");
  });
});

describe("IE6Promise.resolve", () => {
  it("resolves a plain value", () => {
    var result: number | undefined;
    IE6Promise.resolve(42).then(function (v) { result = v; });
    expect(result).toBe(42);
  });

  it("passes through an existing IE6Promise", () => {
    var p = IE6Promise.resolve(99);
    var result = IE6Promise.resolve(p);
    expect(result).toBe(p);
  });
});

describe("IE6Promise.reject", () => {
  it("rejects with reason", () => {
    var reason: any;
    IE6Promise.reject("nope").then(undefined, function (r) { reason = r; });
    expect(reason).toBe("nope");
  });
});

describe("IE6Promise.all", () => {
  it("resolves with all values", () => {
    var result: any;
    IE6Promise.all([
      IE6Promise.resolve(1),
      IE6Promise.resolve(2),
      IE6Promise.resolve(3)
    ]).then(function (v) { result = v; });
    expect(result).toEqual([1, 2, 3]);
  });

  it("resolves with empty array", () => {
    var result: any;
    IE6Promise.all([]).then(function (v) { result = v; });
    expect(result).toEqual([]);
  });

  it("rejects if any promise rejects", () => {
    var reason: any;
    IE6Promise.all([
      IE6Promise.resolve(1),
      IE6Promise.reject("bad"),
      IE6Promise.resolve(3)
    ]).then(undefined, function (r) { reason = r; });
    expect(reason).toBe("bad");
  });

  it("resolves non-promise values", () => {
    var result: any;
    IE6Promise.all([1, IE6Promise.resolve(2), 3]).then(function (v) { result = v; });
    expect(result).toEqual([1, 2, 3]);
  });
});

describe("IE6Promise.race", () => {
  it("resolves with first fulfilled", () => {
    var result: any;
    IE6Promise.race([
      IE6Promise.resolve("fast"),
      IE6Promise.resolve("slow")
    ]).then(function (v) { result = v; });
    expect(result).toBe("fast");
  });

  it("rejects with first rejected", () => {
    var reason: any;
    IE6Promise.race([
      IE6Promise.reject("err"),
      IE6Promise.resolve("ok")
    ]).then(undefined, function (r) { reason = r; });
    expect(reason).toBe("err");
  });
});

describe("IE6Promise.allSettled", () => {
  it("returns all settled results", () => {
    var result: any;
    IE6Promise.allSettled([
      IE6Promise.resolve(1),
      IE6Promise.reject("bad"),
      IE6Promise.resolve(3)
    ]).then(function (v) { result = v; });
    expect(result.length).toBe(3);
    expect(result[0]).toEqual({ status: "fulfilled", value: 1 });
    expect(result[1]).toEqual({ status: "rejected", reason: "bad" });
    expect(result[2]).toEqual({ status: "fulfilled", value: 3 });
  });

  it("resolves with empty array", () => {
    var result: any;
    IE6Promise.allSettled([]).then(function (v) { result = v; });
    expect(result).toEqual([]);
  });
});

describe("IE6Promise.any", () => {
  it("resolves with first fulfilled", () => {
    var result: any;
    IE6Promise.any([
      IE6Promise.resolve("first"),
      IE6Promise.resolve("second")
    ]).then(function (v) { result = v; });
    expect(result).toBe("first");
  });

  it("rejects if all reject", () => {
    var reason: any;
    IE6Promise.any([
      IE6Promise.reject("a"),
      IE6Promise.reject("b")
    ]).then(undefined, function (r) { reason = r; });
    expect(reason).toBeInstanceOf(Error);
  });
});

describe("polyfillPromise", () => {
  it("installs Promise on window if missing", () => {
    // Save and remove
    var orig = (window as any).Promise;
    delete (window as any).Promise;
    polyfillPromise();
    expect((window as any).Promise).toBe(IE6Promise);
    // Restore
    (window as any).Promise = orig;
  });

  it("does not overwrite existing Promise", () => {
    var orig = (window as any).Promise;
    var fake = function () {};
    (window as any).Promise = fake;
    polyfillPromise();
    expect((window as any).Promise).toBe(fake);
    // Restore
    (window as any).Promise = orig;
  });
});
