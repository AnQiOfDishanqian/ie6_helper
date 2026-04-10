/**
 * Array.prototype polyfills for IE6
 * Provides ES5+ Array methods that IE6 lacks
 */

export function polyfillArray(): void {
  // Array.isArray
  if (typeof Array.isArray === "undefined") {
    (Array as any).isArray = function (arg: any): boolean {
      return Object.prototype.toString.call(arg) === "[object Array]";
    };
  }

  // Array.prototype.indexOf
  if (typeof Array.prototype.indexOf === "undefined") {
    Array.prototype.indexOf = function (searchElement: any, fromIndex?: number): number {
      var len = this.length >>> 0;
      var from = fromIndex || 0;
      if (from < 0) {
        from = Math.max(0, len + from);
      }
      for (var i = from; i < len; i++) {
        if (i in this && this[i] === searchElement) {
          return i;
        }
      }
      return -1;
    };
  }

  // Array.prototype.lastIndexOf
  if (typeof Array.prototype.lastIndexOf === "undefined") {
    Array.prototype.lastIndexOf = function (searchElement: any, fromIndex?: number): number {
      var len = this.length >>> 0;
      var from = typeof fromIndex === "number" ? fromIndex : len - 1;
      if (from < 0) {
        from = Math.max(0, len + from);
      }
      for (var i = from; i >= 0; i--) {
        if (i in this && this[i] === searchElement) {
          return i;
        }
      }
      return -1;
    };
  }

  // Array.prototype.forEach
  if (typeof Array.prototype.forEach === "undefined") {
    Array.prototype.forEach = function (callbackfn: (value: any, index: number, array: any[]) => void, thisArg?: any): void {
      var len = this.length >>> 0;
      for (var i = 0; i < len; i++) {
        if (i in this) {
          callbackfn.call(thisArg, this[i], i, this);
        }
      }
    };
  }

  // Array.prototype.map
  if (typeof Array.prototype.map === "undefined") {
    Array.prototype.map = function (callbackfn: (value: any, index: number, array: any[]) => any, thisArg?: any): any[] {
      var len = this.length >>> 0;
      var result = new Array(len);
      for (var i = 0; i < len; i++) {
        if (i in this) {
          result[i] = callbackfn.call(thisArg, this[i], i, this);
        }
      }
      return result;
    };
  }

  // Array.prototype.filter
  if (typeof Array.prototype.filter === "undefined") {
    Array.prototype.filter = function (callbackfn: (value: any, index: number, array: any[]) => boolean, thisArg?: any): any[] {
      var len = this.length >>> 0;
      var result: any[] = [];
      for (var i = 0; i < len; i++) {
        if (i in this) {
          var val = this[i];
          if (callbackfn.call(thisArg, val, i, this)) {
            result.push(val);
          }
        }
      }
      return result;
    };
  }

  // Array.prototype.every
  if (typeof Array.prototype.every === "undefined") {
    (Array.prototype as any).every = function (callbackfn: (value: any, index: number, array: any[]) => boolean, thisArg?: any): boolean {
      var len = this.length >>> 0;
      for (var i = 0; i < len; i++) {
        if (i in this && !callbackfn.call(thisArg, this[i], i, this)) {
          return false;
        }
      }
      return true;
    };
  }

  // Array.prototype.some
  if (typeof Array.prototype.some === "undefined") {
    Array.prototype.some = function (callbackfn: (value: any, index: number, array: any[]) => boolean, thisArg?: any): boolean {
      var len = this.length >>> 0;
      for (var i = 0; i < len; i++) {
        if (i in this && callbackfn.call(thisArg, this[i], i, this)) {
          return true;
        }
      }
      return false;
    };
  }

  // Array.prototype.reduce
  if (typeof Array.prototype.reduce === "undefined") {
    Array.prototype.reduce = function (callbackfn: (prev: any, curr: any, index: number, array: any[]) => any, initialValue?: any): any {
      var len = this.length >>> 0;
      var i = 0;
      var accumulator;
      if (arguments.length >= 2) {
        accumulator = initialValue;
      } else {
        while (i < len && !(i in this)) {
          i++;
        }
        if (i >= len) {
          throw new TypeError("Reduce of empty array with no initial value");
        }
        accumulator = this[i++];
      }
      for (; i < len; i++) {
        if (i in this) {
          accumulator = callbackfn(accumulator, this[i], i, this);
        }
      }
      return accumulator;
    };
  }

  // Array.prototype.reduceRight
  if (typeof Array.prototype.reduceRight === "undefined") {
    Array.prototype.reduceRight = function (callbackfn: (prev: any, curr: any, index: number, array: any[]) => any, initialValue?: any): any {
      var len = this.length >>> 0;
      var i = len - 1;
      var accumulator;
      if (arguments.length >= 2) {
        accumulator = initialValue;
      } else {
        while (i >= 0 && !(i in this)) {
          i--;
        }
        if (i < 0) {
          throw new TypeError("Reduce of empty array with no initial value");
        }
        accumulator = this[i--];
      }
      for (; i >= 0; i--) {
        if (i in this) {
          accumulator = callbackfn(accumulator, this[i], i, this);
        }
      }
      return accumulator;
    };
  }

  // Array.prototype.find (ES6)
  if (typeof Array.prototype.find === "undefined") {
    Array.prototype.find = function (predicate: (value: any, index: number, obj: any[]) => boolean, thisArg?: any): any {
      var len = this.length >>> 0;
      for (var i = 0; i < len; i++) {
        if (i in this && predicate.call(thisArg, this[i], i, this)) {
          return this[i];
        }
      }
      return undefined;
    };
  }

  // Array.prototype.findIndex (ES6)
  if (typeof Array.prototype.findIndex === "undefined") {
    Array.prototype.findIndex = function (predicate: (value: any, index: number, obj: any[]) => boolean, thisArg?: any): number {
      var len = this.length >>> 0;
      for (var i = 0; i < len; i++) {
        if (i in this && predicate.call(thisArg, this[i], i, this)) {
          return i;
        }
      }
      return -1;
    };
  }

  // Array.prototype.fill (ES6)
  if (typeof Array.prototype.fill === "undefined") {
    Array.prototype.fill = function (value: any, start?: number, end?: number): any[] {
      var len = this.length >>> 0;
      var from = start || 0;
      if (from < 0) {
        from = Math.max(0, len + from);
      }
      var to = typeof end === "number" ? end : len;
      if (to < 0) {
        to = Math.max(0, len + to);
      }
      for (var i = from; i < to && i < len; i++) {
        this[i] = value;
      }
      return this;
    };
  }

  // Array.of (ES6)
  if (typeof (Array as any).of === "undefined") {
    (Array as any).of = function (...items: any[]): any[] {
      var result: any[] = [];
      for (var i = 0; i < items.length; i++) {
        result[i] = items[i];
      }
      result.length = items.length;
      return result;
    };
  }

  // Array.from (ES6) - basic version without iterable support
  if (typeof (Array as any).from === "undefined") {
    (Array as any).from = function (source: any, mapFn?: (value: any, index: number) => any, thisArg?: any): any[] {
      var result: any[] = [];
      var items;
      if (typeof source === "string" || (source && typeof source.length === "number")) {
        items = source;
      } else {
        throw new TypeError("Array.from requires an array-like object");
      }
      var len = items.length >>> 0;
      for (var i = 0; i < len; i++) {
        var val = items[i];
        if (mapFn) {
          result[i] = mapFn.call(thisArg, val, i);
        } else {
          result[i] = val;
        }
      }
      result.length = len;
      return result;
    };
  }
}
