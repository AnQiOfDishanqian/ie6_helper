/**
 * Utility helpers that provide ES6+ features for IE6
 * These are standalone functions (not prototype extensions)
 */

/**
 * Creates a Promise-like deferred object for IE6.
 * IE6 has no native Promise, so this provides a minimal "thenable" pattern.
 */
export function createDeferred<T>(): {
  resolve: (value: T) => void;
  reject: (reason: any) => void;
  promise: {
    then: (onFulfilled?: (value: T) => void, onRejected?: (reason: any) => void) => any;
  };
} {
  var state = "pending";
  var value: any;
  var callbacks: { onFulfilled?: Function; onRejected?: Function }[] = [];

  function resolve(val: T): void {
    if (state !== "pending") return;
    state = "resolved";
    value = val;
    for (var i = 0; i < callbacks.length; i++) {
      if (callbacks[i].onFulfilled) {
        callbacks[i].onFulfilled!(value);
      }
    }
    callbacks = [];
  }

  function reject(reason: any): void {
    if (state !== "pending") return;
    state = "rejected";
    value = reason;
    for (var i = 0; i < callbacks.length; i++) {
      if (callbacks[i].onRejected) {
        callbacks[i].onRejected!(value);
      }
    }
    callbacks = [];
  }

  function then(
    onFulfilled?: (value: T) => void,
    onRejected?: (reason: any) => void
  ): any {
    if (state === "resolved" && onFulfilled) {
      onFulfilled(value);
    } else if (state === "rejected" && onRejected) {
      onRejected(value);
    } else if (state === "pending") {
      callbacks.push({ onFulfilled: onFulfilled, onRejected: onRejected });
    }
  }

  return {
    resolve: resolve,
    reject: reject,
    promise: { then: then }
  };
}

/**
 * A simple Map-like utility for IE6.
 * Uses an array of key-value pairs since IE6 objects don't preserve key order
 * and have issues with non-string keys.
 */
export function createMap(): {
  get: (key: any) => any;
  set: (key: any, value: any) => void;
  has: (key: any) => boolean;
  delete: (key: any) => boolean;
  size: () => number;
  keys: () => any[];
  values: () => any[];
  forEach: (callback: (value: any, key: any) => void) => void;
} {
  var entries: { key: any; value: any }[] = [];

  function findIndex(k: any): number {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].key === k) {
        return i;
      }
    }
    return -1;
  }

  return {
    get: function (key: any): any {
      var idx = findIndex(key);
      return idx >= 0 ? entries[idx].value : undefined;
    },
    set: function (key: any, value: any): void {
      var idx = findIndex(key);
      if (idx >= 0) {
        entries[idx].value = value;
      } else {
        entries.push({ key: key, value: value });
      }
    },
    has: function (key: any): boolean {
      return findIndex(key) >= 0;
    },
    delete: function (key: any): boolean {
      var idx = findIndex(key);
      if (idx >= 0) {
        entries.splice(idx, 1);
        return true;
      }
      return false;
    },
    size: function (): number {
      return entries.length;
    },
    keys: function (): any[] {
      var result: any[] = [];
      for (var i = 0; i < entries.length; i++) {
        result.push(entries[i].key);
      }
      return result;
    },
    values: function (): any[] {
      var result: any[] = [];
      for (var i = 0; i < entries.length; i++) {
        result.push(entries[i].value);
      }
      return result;
    },
    forEach: function (callback: (value: any, key: any) => void): void {
      for (var i = 0; i < entries.length; i++) {
        callback(entries[i].value, entries[i].key);
      }
    }
  };
}

/**
 * A simple Set-like utility for IE6.
 */
export function createSet(): {
  add: (value: any) => void;
  has: (value: any) => boolean;
  delete: (value: any) => boolean;
  size: () => number;
  values: () => any[];
  forEach: (callback: (value: any) => void) => void;
} {
  var items: any[] = [];

  return {
    add: function (value: any): void {
      for (var i = 0; i < items.length; i++) {
        if (items[i] === value) return;
      }
      items.push(value);
    },
    has: function (value: any): boolean {
      for (var i = 0; i < items.length; i++) {
        if (items[i] === value) return true;
      }
      return false;
    },
    delete: function (value: any): boolean {
      for (var i = 0; i < items.length; i++) {
        if (items[i] === value) {
          items.splice(i, 1);
          return true;
        }
      }
      return false;
    },
    size: function (): number {
      return items.length;
    },
    values: function (): any[] {
      var result: any[] = [];
      for (var i = 0; i < items.length; i++) {
        result.push(items[i]);
      }
      return result;
    },
    forEach: function (callback: (value: any) => void): void {
      for (var i = 0; i < items.length; i++) {
        callback(items[i]);
      }
    }
  };
}

/**
 * requestAnimationFrame polyfill for IE6
 */
export function polyfillRequestAnimationFrame(): void {
  if (typeof window.requestAnimationFrame === "undefined") {
    var lastTime = 0;
    (window as any).requestAnimationFrame = function (callback: (timestamp: number) => void): number {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
  if (typeof window.cancelAnimationFrame === "undefined") {
    (window as any).cancelAnimationFrame = function (id: number): void {
      clearTimeout(id);
    };
  }
}
