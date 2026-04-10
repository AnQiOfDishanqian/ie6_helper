/**
 * Date polyfills for IE6
 * Provides ES5 Date.now and ISO methods
 */

export function polyfillDate(): void {
  // Date.now (ES5)
  if (typeof Date.now === "undefined") {
    Date.now = function (): number {
      return new Date().getTime();
    };
  }

  // Date.prototype.toISOString (ES5)
  if (typeof Date.prototype.toISOString === "undefined") {
    Date.prototype.toISOString = function (): string {
      function pad(n: number, len?: number): string {
        var s = String(n);
        var l = len || 2;
        while (s.length < l) {
          s = "0" + s;
        }
        return s;
      }
      return (
        pad(this.getUTCFullYear(), 4) + "-" +
        pad(this.getUTCMonth() + 1) + "-" +
        pad(this.getUTCDate()) + "T" +
        pad(this.getUTCHours()) + ":" +
        pad(this.getUTCMinutes()) + ":" +
        pad(this.getUTCSeconds()) + "." +
        pad(this.getUTCMilliseconds(), 3) + "Z"
      );
    };
  }

  // Date.prototype.toJSON (ES5)
  if (typeof Date.prototype.toJSON === "undefined") {
    Date.prototype.toJSON = function (_key?: any): string {
      return this.toISOString();
    };
  }
}
