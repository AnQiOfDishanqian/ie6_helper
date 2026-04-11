/**
 * Promise polyfill for IE6
 * Implements ES6 Promise with then, catch, finally, and static methods.
 * Uses synchronous resolution (no microtask queue) for IE6 compatibility.
 */

type ResolveFn<T> = (value: T | PromiseLike<T>) => void;
type RejectFn = (reason: any) => void;
type Executor<T> = (resolve: ResolveFn<T>, reject: RejectFn) => void;
type OnFulfilled<T, R> = ((value: T) => R | PromiseLike<R>) | null | undefined;
type OnRejected<R> = ((reason: any) => R | PromiseLike<R>) | null | undefined;

var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;

function isFunction(val: any): boolean {
  return typeof val === "function";
}

function isThenable(val: any): boolean {
  return val !== null && (typeof val === "object" || typeof val === "function");
}

/**
 * Resolve a promise with a value that may be a thenable.
 */
function resolvePromise<T>(promise: IE6Promise<T>, value: any): void {
  if (promise === value) {
    rejectPromise(promise, new TypeError("A promise cannot be resolved with itself."));
    return;
  }
  if (isThenable(value)) {
    var then: any;
    try {
      then = value.then;
    } catch (_e) {
      rejectPromise(promise, _e);
      return;
    }
    if (isFunction(then)) {
      var called = false;
      try {
        then.call(
          value,
          function (y: any) {
            if (called) return;
            called = true;
            resolvePromise(promise, y);
          },
          function (r: any) {
            if (called) return;
            called = true;
            rejectPromise(promise, r);
          }
        );
      } catch (_e2) {
        if (!called) {
          rejectPromise(promise, _e2);
        }
      }
    } else {
      fulfillPromise(promise, value);
    }
  } else {
    fulfillPromise(promise, value);
  }
}

function fulfillPromise<T>(promise: IE6Promise<T>, value: any): void {
  if (promise._state !== PENDING) return;
  promise._state = FULFILLED;
  promise._value = value;
  finale(promise);
}

function rejectPromise<T>(promise: IE6Promise<T>, reason: any): void {
  if (promise._state !== PENDING) return;
  promise._state = REJECTED;
  promise._value = reason;
  finale(promise);
}

function finale<T>(promise: IE6Promise<T>): void {
  for (var i = 0; i < promise._handlers.length; i++) {
    handleResolved(promise, promise._handlers[i]);
  }
  promise._handlers = [];
}

function handleResolved<T>(promise: IE6Promise<T>, handler: Handler): void {
  if (promise._state === FULFILLED) {
    if (isFunction(handler.onFulfilled)) {
      try {
        var ret = handler.onFulfilled(promise._value);
        resolvePromise(handler.promise, ret);
      } catch (e) {
        rejectPromise(handler.promise, e);
      }
    } else {
      resolvePromise(handler.promise, promise._value);
    }
  } else if (promise._state === REJECTED) {
    if (isFunction(handler.onRejected)) {
      try {
        var ret = handler.onRejected(promise._value);
        resolvePromise(handler.promise, ret);
      } catch (e) {
        rejectPromise(handler.promise, e);
      }
    } else {
      rejectPromise(handler.promise, promise._value);
    }
  }
}

interface Handler {
  onFulfilled: Function | null;
  onRejected: Function | null;
  promise: IE6Promise<any>;
}

class IE6Promise<T> {
  _state: number;
  _value: any;
  _handlers: Handler[];

  constructor(executor: Executor<T>) {
    this._state = PENDING;
    this._value = undefined;
    this._handlers = [];

    var self = this;
    try {
      executor(
        function (value: T | PromiseLike<T>) {
          resolvePromise(self, value);
        },
        function (reason: any) {
          rejectPromise(self, reason);
        }
      );
    } catch (e) {
      rejectPromise(self, e);
    }
  }

  then<R>(onFulfilled?: OnFulfilled<T, R>, onRejected?: OnRejected<R>): IE6Promise<R> {
    var child = new IE6Promise<R>(function () {});
    var handler: Handler = {
      onFulfilled: isFunction(onFulfilled) ? onFulfilled : null,
      onRejected: isFunction(onRejected) ? onRejected : null,
      promise: child
    };

    if (this._state === PENDING) {
      this._handlers.push(handler);
    } else {
      handleResolved(this, handler);
    }
    return child;
  }

  catch<R>(onRejected?: OnRejected<R>): IE6Promise<R> {
    return this.then(undefined, onRejected);
  }

  finally(onFinally?: (() => void) | null | undefined): IE6Promise<T> {
    return this.then(
      function (value: T) {
        if (isFunction(onFinally)) onFinally();
        return value;
      },
      function (reason: any) {
        if (isFunction(onFinally)) onFinally();
        throw reason;
      }
    );
  }

  static resolve<T>(value: T | PromiseLike<T>): IE6Promise<T> {
    if (value instanceof IE6Promise) {
      return value;
    }
    return new IE6Promise<T>(function (resolve) {
      resolve(value);
    });
  }

  static reject(reason: any): IE6Promise<any> {
    return new IE6Promise(function (_resolve, reject) {
      reject(reason);
    });
  }

  static all(promises: any[]): IE6Promise<any[]> {
    return new IE6Promise(function (resolve, reject) {
      var results: any[] = [];
      var remaining = promises.length;
      if (remaining === 0) {
        resolve(results);
        return;
      }
      for (var i = 0; i < promises.length; i++) {
        (function (index: number) {
          IE6Promise.resolve(promises[index]).then(
            function (value: any) {
              results[index] = value;
              remaining--;
              if (remaining === 0) {
                resolve(results);
              }
            },
            reject
          );
        })(i);
      }
    });
  }

  static race(promises: any[]): IE6Promise<any> {
    return new IE6Promise(function (resolve, reject) {
      for (var i = 0; i < promises.length; i++) {
        IE6Promise.resolve(promises[i]).then(resolve, reject);
      }
    });
  }

  static allSettled(promises: any[]): IE6Promise<any[]> {
    return new IE6Promise(function (resolve) {
      var results: any[] = [];
      var remaining = promises.length;
      if (remaining === 0) {
        resolve(results);
        return;
      }
      for (var i = 0; i < promises.length; i++) {
        (function (index: number) {
          IE6Promise.resolve(promises[index]).then(
            function (value: any) {
              results[index] = { status: "fulfilled", value: value };
              remaining--;
              if (remaining === 0) resolve(results);
            },
            function (reason: any) {
              results[index] = { status: "rejected", reason: reason };
              remaining--;
              if (remaining === 0) resolve(results);
            }
          );
        })(i);
      }
    });
  }

  static any(promises: any[]): IE6Promise<any> {
    return new IE6Promise(function (resolve, reject) {
      var errors: any[] = [];
      var remaining = promises.length;
      if (remaining === 0) {
        reject(new Error("All promises were rejected"));
        return;
      }
      for (var i = 0; i < promises.length; i++) {
        (function (index: number) {
          IE6Promise.resolve(promises[index]).then(
            resolve,
            function (reason: any) {
              errors[index] = reason;
              remaining--;
              if (remaining === 0) {
                reject(new Error("All promises were rejected"));
              }
            }
          );
        })(i);
      }
    });
  }
}

/**
 * Installs the Promise polyfill if not natively available.
 */
export function polyfillPromise(): void {
  if (typeof (window as any).Promise === "undefined") {
    (window as any).Promise = IE6Promise;
  }
}

export { IE6Promise };
