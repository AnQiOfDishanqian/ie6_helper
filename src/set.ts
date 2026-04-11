/**
 * Set polyfill for IE6
 * Implements ES6 Set using an internal array of values.
 * Uses SameValueZero equality (NaN === NaN).
 */

function sameValueZero(a: any, b: any): boolean {
  return a === b || (a !== a && b !== b);
}

function isArray(val: any): boolean {
  if (typeof Array.isArray === "function") {
    return Array.isArray(val);
  }
  return Object.prototype.toString.call(val) === "[object Array]";
}

class IE6Set {
  _items: any[];

  constructor(iterable?: any[] | Iterable<any>) {
    this._items = [];
    if (iterable) {
      if (typeof (iterable as any)["forEach"] === "function") {
        (iterable as any).forEach(function (value: any) {
          this.add(value);
        }.bind(this));
      } else if (isArray(iterable)) {
        for (var i = 0; i < (iterable as any[]).length; i++) {
          this.add((iterable as any[])[i]);
        }
      }
    }
  }

  get size(): number {
    return this._items.length;
  }

  add(value: any): IE6Set {
    for (var i = 0; i < this._items.length; i++) {
      if (sameValueZero(this._items[i], value)) {
        return this;
      }
    }
    this._items.push(value);
    return this;
  }

  has(value: any): boolean {
    for (var i = 0; i < this._items.length; i++) {
      if (sameValueZero(this._items[i], value)) {
        return true;
      }
    }
    return false;
  }

  delete(value: any): boolean {
    for (var i = 0; i < this._items.length; i++) {
      if (sameValueZero(this._items[i], value)) {
        this._items.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  clear(): void {
    this._items = [];
  }

  forEach(callback: (value: any, key: any, set: IE6Set) => void, thisArg?: any): void {
    for (var i = 0; i < this._items.length; i++) {
      callback.call(thisArg, this._items[i], this._items[i], this);
    }
  }

  keys(): any[] {
    var result: any[] = [];
    for (var i = 0; i < this._items.length; i++) {
      result.push(this._items[i]);
    }
    return result;
  }

  values(): any[] {
    var result: any[] = [];
    for (var i = 0; i < this._items.length; i++) {
      result.push(this._items[i]);
    }
    return result;
  }

  entries(): any[] {
    var result: any[] = [];
    for (var i = 0; i < this._items.length; i++) {
      result.push([this._items[i], this._items[i]]);
    }
    return result;
  }
}

/**
 * Installs the Set polyfill if not natively available.
 */
export function polyfillSet(): void {
  if (typeof (window as any).Set === "undefined") {
    (window as any).Set = IE6Set;
  }
}

export { IE6Set };
