/**
 * Function.prototype polyfills for IE6
 * Provides ES5 Function.prototype.bind and helper utilities
 */

export function polyfillFunction(): void {
  // Function.prototype.bind (ES5)
  if (typeof Function.prototype.bind === "undefined") {
    Function.prototype.bind = function (thisArg: any, ...args: any[]): Function {
      var fn = this;
      if (typeof fn !== "function") {
        throw new TypeError("Function.prototype.bind called on incompatible " + typeof fn);
      }
      var bound = function (): any {
        var finalArgs = args.concat(Array.prototype.slice.call(arguments));
        // Check if called as constructor
        if (this instanceof (bound as any)) {
          var result = fn.apply(this, finalArgs);
          if (Object(result) === result) {
            return result;
          }
          return this;
        }
        return fn.apply(thisArg, finalArgs);
      };
      // Maintain prototype chain for constructor calls
      var NOP = function () {};
      NOP.prototype = fn.prototype;
      bound.prototype = new (NOP as any)();
      return bound;
    };
  }
}
