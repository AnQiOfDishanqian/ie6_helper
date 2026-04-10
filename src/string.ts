/**
 * String.prototype polyfills for IE6
 * Provides ES5+ String methods that IE6 lacks
 */

export function polyfillString(): void {
  // String.prototype.trim (ES5)
  if (typeof String.prototype.trim === "undefined") {
    String.prototype.trim = function (): string {
      return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    };
  }

  // String.prototype.startsWith (ES6)
  if (typeof String.prototype.startsWith === "undefined") {
    String.prototype.startsWith = function (searchString: string, position?: number): boolean {
      var pos = position || 0;
      return this.substr(pos, searchString.length) === searchString;
    };
  }

  // String.prototype.endsWith (ES6)
  if (typeof String.prototype.endsWith === "undefined") {
    String.prototype.endsWith = function (searchString: string, endPosition?: number): boolean {
      var len = this.length;
      var end = typeof endPosition === "number" ? endPosition : len;
      var start = end - searchString.length;
      if (start < 0) {
        return false;
      }
      return this.substr(start, searchString.length) === searchString;
    };
  }

  // String.prototype.includes (ES6)
  if (typeof String.prototype.includes === "undefined") {
    String.prototype.includes = function (searchString: string, position?: number): boolean {
      return this.indexOf(searchString, position) !== -1;
    };
  }

  // String.prototype.repeat (ES6)
  if (typeof String.prototype.repeat === "undefined") {
    String.prototype.repeat = function (count: number): string {
      if (count < 0) {
        throw new RangeError("Repeat count must be non-negative");
      }
      if (count === Infinity) {
        throw new RangeError("Repeat count must be less than infinity");
      }
      var result = "";
      for (var i = 0; i < count; i++) {
        result += this;
      }
      return result;
    };
  }

  // String.prototype.padStart (ES2017)
  if (typeof String.prototype.padStart === "undefined") {
    String.prototype.padStart = function (maxLength: number, fillString?: string): string {
      var fill = fillString !== undefined ? String(fillString) : " ";
      if (fill === "") {
        return this;
      }
      var str = String(this);
      var padLen = maxLength - str.length;
      if (padLen <= 0) {
        return str;
      }
      var pad = "";
      while (pad.length < padLen) {
        pad += fill;
      }
      return pad.substr(0, padLen) + str;
    };
  }

  // String.prototype.padEnd (ES2017)
  if (typeof String.prototype.padEnd === "undefined") {
    String.prototype.padEnd = function (maxLength: number, fillString?: string): string {
      var fill = fillString !== undefined ? String(fillString) : " ";
      if (fill === "") {
        return this;
      }
      var str = String(this);
      var padLen = maxLength - str.length;
      if (padLen <= 0) {
        return str;
      }
      var pad = "";
      while (pad.length < padLen) {
        pad += fill;
      }
      return str + pad.substr(0, padLen);
    };
  }

  // String.raw (ES6)
  if (typeof (String as any).raw === "undefined") {
    (String as any).raw = function (callSite: any, ...substitutions: any[]): string {
      var raw = callSite.raw;
      var result = "";
      for (var i = 0; i < raw.length; i++) {
        result += raw[i];
        if (i < substitutions.length) {
          result += substitutions[i];
        }
      }
      return result;
    };
  }
}
