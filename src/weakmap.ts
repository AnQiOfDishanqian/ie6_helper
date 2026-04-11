/**
 * WeakMap polyfill for IE6
 * Uses a hidden property on object keys to store values.
 * Since IE6 doesn't support WeakMap's GC behavior, this is a
 * best-effort implementation that stores values via a non-enumerable
 * property on the key object.
 */

var weakMapId = 0;
var WEAK_MAP_PREFIX = "__ie6_wm_";

function isObject(val: any): boolean {
  return val !== null && (typeof val === "object" || typeof val === "function");
}

class IE6WeakMap {
  _id: string;

  constructor(iterable?: any[] | Iterable<[any, any]>) {
    this._id = WEAK_MAP_PREFIX + (++weakMapId) + "__";

    if (iterable) {
      if (typeof (iterable as any)["forEach"] === "function") {
        (iterable as any).forEach(function (entry: any) {
          if (entry && isObject(entry[0])) {
            this.set(entry[0], entry[1]);
          }
        }.bind(this));
      } else if (typeof (iterable as any).length === "number") {
        for (var i = 0; i < (iterable as any[]).length; i++) {
          var entry = (iterable as any[])[i];
          if (entry && isObject(entry[0])) {
            this.set(entry[0], entry[1]);
          }
        }
      }
    }
  }

  get(key: any): any {
    if (!isObject(key)) return undefined;
    var entry = (key as any)[this._id];
    if (entry) return entry.v;
    return undefined;
  }

  set(key: any, value: any): IE6WeakMap {
    if (!isObject(key)) {
      throw new TypeError("Invalid value used as weak map key");
    }
    (key as any)[this._id] = { v: value };
    return this;
  }

  has(key: any): boolean {
    if (!isObject(key)) return false;
    return (key as any)[this._id] !== undefined;
  }

  delete(key: any): boolean {
    if (!isObject(key)) return false;
    if ((key as any)[this._id] !== undefined) {
      delete (key as any)[this._id];
      return true;
    }
    return false;
  }
}

/**
 * Installs the WeakMap polyfill if not natively available.
 */
export function polyfillWeakMap(): void {
  if (typeof (window as any).WeakMap === "undefined") {
    (window as any).WeakMap = IE6WeakMap;
  }
}

export { IE6WeakMap };
