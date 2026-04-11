/**
 * Map polyfill for IE6
 * Implements ES6 Map using an internal array of entries.
 * Supports any key type (including NaN), unlike plain objects.
 */

function sameValueZero(a: any, b: any): boolean {
  // NaN === NaN → true, otherwise === comparison
  return a === b || (a !== a && b !== b);
}

class IE6Map {
  _entries: { key: any; value: any }[];

  constructor(iterable?: any[] | Iterable<[any, any]>) {
    this._entries = [];
    if (iterable) {
      // Support array of [key, value] pairs
      var items: any = iterable;
      if (isFunction(items["forEach"])) {
        items["forEach"](function (entry: any) {
          if (entry && isObject(entry)) {
            this.set(entry[0], entry[1]);
          }
        }.bind(this));
      } else if (isArray(items)) {
        for (var i = 0; i < items.length; i++) {
          if (items[i] && isObject(items[i])) {
            this.set(items[i][0], items[i][1]);
          }
        }
      }
    }
  }

  get size(): number {
    return this._entries.length;
  }

  get(key: any): any {
    for (var i = 0; i < this._entries.length; i++) {
      if (sameValueZero(this._entries[i].key, key)) {
        return this._entries[i].value;
      }
    }
    return undefined;
  }

  set(key: any, value: any): IE6Map {
    for (var i = 0; i < this._entries.length; i++) {
      if (sameValueZero(this._entries[i].key, key)) {
        this._entries[i].value = value;
        return this;
      }
    }
    this._entries.push({ key: key, value: value });
    return this;
  }

  has(key: any): boolean {
    for (var i = 0; i < this._entries.length; i++) {
      if (sameValueZero(this._entries[i].key, key)) {
        return true;
      }
    }
    return false;
  }

  delete(key: any): boolean {
    for (var i = 0; i < this._entries.length; i++) {
      if (sameValueZero(this._entries[i].key, key)) {
        this._entries.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  clear(): void {
    this._entries = [];
  }

  forEach(callback: (value: any, key: any, map: IE6Map) => void, thisArg?: any): void {
    for (var i = 0; i < this._entries.length; i++) {
      callback.call(thisArg, this._entries[i].value, this._entries[i].key, this);
    }
  }

  keys(): any[] {
    var result: any[] = [];
    for (var i = 0; i < this._entries.length; i++) {
      result.push(this._entries[i].key);
    }
    return result;
  }

  values(): any[] {
    var result: any[] = [];
    for (var i = 0; i < this._entries.length; i++) {
      result.push(this._entries[i].value);
    }
    return result;
  }

  entries(): any[] {
    var result: any[] = [];
    for (var i = 0; i < this._entries.length; i++) {
      result.push([this._entries[i].key, this._entries[i].value]);
    }
    return result;
  }
}

function isObject(val: any): boolean {
  return val !== null && typeof val === "object";
}

function isFunction(val: any): boolean {
  return typeof val === "function";
}

function isArray(val: any): boolean {
  if (typeof Array.isArray === "function") {
    return Array.isArray(val);
  }
  return Object.prototype.toString.call(val) === "[object Array]";
}

/**
 * Installs the Map polyfill if not natively available.
 */
export function polyfillMap(): void {
  if (typeof (window as any).Map === "undefined") {
    (window as any).Map = IE6Map;
  }
}

export { IE6Map };
