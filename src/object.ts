/**
 * Object polyfills for IE6
 * Provides ES5+ Object static methods that IE6 lacks
 */

export function polyfillObject(): void {
  // Object.keys
  if (typeof Object.keys === "undefined") {
    Object.keys = function (obj: any): string[] {
      if (obj === null || obj === undefined) {
        throw new TypeError("Object.keys called on non-object");
      }
      var result: string[] = [];
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var hasDontEnumBug = !{ toString: null }.propertyIsEnumerable("toString");
      var dontEnums = [
        "toString", "toLocaleString", "valueOf",
        "hasOwnProperty", "isPrototypeOf",
        "propertyIsEnumerable", "constructor"
      ];
      for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          result.push(key);
        }
      }
      if (hasDontEnumBug) {
        for (var i = 0; i < dontEnums.length; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }

  // Object.create - stores __proto__ for getPrototypeOf compatibility
  if (typeof Object.create === "undefined") {
    Object.create = function (proto: any, propertiesObject?: any): any {
      if (proto === null) {
        var F = function () {};
        F.prototype = null;
        var result = new (F as any)();
        return result;
      }
      if (typeof proto !== "object" && typeof proto !== "function") {
        throw new TypeError("Object prototype may only be an Object or null");
      }
      var F = function () {};
      F.prototype = proto;
      var result = new (F as any)();
      // Store prototype reference for getPrototypeOf polyfill
      (result as any).__ie6_proto__ = proto;
      if (propertiesObject !== undefined) {
        Object.defineProperties(result, propertiesObject);
      }
      return result;
    };
  }

  // Object.getPrototypeOf
  if (typeof Object.getPrototypeOf === "undefined") {
    Object.getPrototypeOf = function (obj: any): any {
      if (obj === null || obj === undefined) {
        throw new TypeError("Cannot convert undefined or null to object");
      }
      // Check for stored prototype from Object.create polyfill
      if (obj.__ie6_proto__ !== undefined) {
        return obj.__ie6_proto__;
      }
      return obj.constructor ? obj.constructor.prototype : null;
    };
  }

  // Object.defineProperty - best effort for IE6
  if (typeof Object.defineProperty === "undefined") {
    Object.defineProperty = function (obj: any, prop: string, descriptor: any): any {
      if (descriptor && (descriptor.get || descriptor.set)) {
        // IE6 doesn't support getters/setters; silently ignore
        return obj;
      }
      if (descriptor && "value" in descriptor) {
        obj[prop] = descriptor.value;
      }
      return obj;
    };
  }

  // Object.defineProperties
  if (typeof Object.defineProperties === "undefined") {
    Object.defineProperties = function (obj: any, properties: any): any {
      if (obj === null || obj === undefined) {
        throw new TypeError("Cannot convert undefined or null to object");
      }
      var keys = Object.keys(properties);
      for (var i = 0; i < keys.length; i++) {
        Object.defineProperty(obj, keys[i], properties[keys[i]]);
      }
      return obj;
    };
  }

  // Object.getOwnPropertyDescriptor
  if (typeof Object.getOwnPropertyDescriptor === "undefined") {
    Object.getOwnPropertyDescriptor = function (obj: any, prop: string): any {
      if (obj === null || obj === undefined) {
        throw new TypeError("Cannot convert undefined or null to object");
      }
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      if (!hasOwnProperty.call(obj, prop)) {
        return undefined;
      }
      return {
        value: obj[prop],
        writable: true,
        enumerable: true,
        configurable: true
      };
    };
  }

  // Object.hasOwnProperty - already exists in IE6 via prototype, no polyfill needed

  // Object.is (ES6)
  if (typeof (Object as any).is === "undefined") {
    (Object as any).is = function (x: any, y: any): boolean {
      // SameValue algorithm
      if (x === y) {
        // 0 === -0, but they are not identical
        return x !== 0 || 1 / x === 1 / y;
      }
      // NaN !== NaN, but they are identical
      return x !== x && y !== y;
    };
  }

  // Object.assign (ES6)
  if (typeof (Object as any).assign === "undefined") {
    (Object as any).assign = function (target: any, ...sources: any[]): any {
      if (target === null || target === undefined) {
        throw new TypeError("Cannot convert undefined or null to object");
      }
      var result = Object(target);
      for (var i = 0; i < sources.length; i++) {
        var source = sources[i];
        if (source !== null && source !== undefined) {
          var keys = Object.keys(source);
          for (var j = 0; j < keys.length; j++) {
            result[keys[j]] = source[keys[j]];
          }
        }
      }
      return result;
    };
  }

  // Object.freeze (ES5) - best effort, cannot truly freeze in IE6
  if (typeof Object.freeze === "undefined") {
    Object.freeze = function (obj: any): any {
      return obj;
    };
  }

  // Object.seal (ES5) - best effort
  if (typeof Object.seal === "undefined") {
    Object.seal = function (obj: any): any {
      return obj;
    };
  }

  // Object.preventExtensions (ES5) - best effort
  if (typeof Object.preventExtensions === "undefined") {
    Object.preventExtensions = function (obj: any): any {
      return obj;
    };
  }

  // Object.isFrozen (ES5)
  if (typeof Object.isFrozen === "undefined") {
    Object.isFrozen = function (_obj: any): boolean {
      return false;
    };
  }

  // Object.isSealed (ES5)
  if (typeof Object.isSealed === "undefined") {
    Object.isSealed = function (_obj: any): boolean {
      return false;
    };
  }

  // Object.isExtensible (ES5)
  if (typeof Object.isExtensible === "undefined") {
    Object.isExtensible = function (_obj: any): boolean {
      return true;
    };
  }

  // Object.values (ES2017)
  if (typeof (Object as any).values === "undefined") {
    (Object as any).values = function (obj: any): any[] {
      var keys = Object.keys(obj);
      var result: any[] = [];
      for (var i = 0; i < keys.length; i++) {
        result.push(obj[keys[i]]);
      }
      return result;
    };
  }

  // Object.entries (ES2017)
  if (typeof (Object as any).entries === "undefined") {
    (Object as any).entries = function (obj: any): [string, any][] {
      var keys = Object.keys(obj);
      var result: [string, any][] = [];
      for (var i = 0; i < keys.length; i++) {
        result.push([keys[i], obj[keys[i]]]);
      }
      return result;
    };
  }
}
