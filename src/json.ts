/**
 * JSON polyfill for IE6
 * IE6 does not have native JSON support
 */

export function polyfillJSON(): void {
  if (typeof JSON === "undefined") {
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var meta: { [key: string]: string } = {
      "\b": "\\b",
      "\t": "\\t",
      "\n": "\\n",
      "\f": "\\f",
      "\r": "\\r",
      "\"": "\\\"",
      "\\": "\\\\"
    };

    var quote = function (str: string): string {
      escapable.lastIndex = 0;
      return escapable.test(str)
        ? "\"" + str.replace(escapable, function (a: string): string {
            var c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
          }) + "\""
        : "\"" + str + "\"";
    };

    var str = function (key: string, holder: any, replacer?: Function, space?: string, indent?: string): string {
      var value = holder[key];

      if (value && typeof value === "object" && typeof value.toJSON === "function") {
        value = value.toJSON(key);
      }

      if (replacer) {
        value = replacer.call(holder, key, value);
      }

      if (value === null) {
        return "null";
      }

      var currentIndent = indent || "";
      var nextIndent = currentIndent + (space || "");

      switch (typeof value) {
        case "string":
          return quote(value);
        case "number":
          return isFinite(value) ? String(value) : "null";
        case "boolean":
          return String(value);
        case "object":
          if (!value) {
            return "null";
          }
          var partial: string[] = [];
          if (Object.prototype.toString.apply(value) === "[object Array]") {
            var length = value.length;
            for (var i = 0; i < length; i++) {
              partial[i] = str(String(i), value, replacer, space, nextIndent) || "null";
            }
            if (space && partial.length > 0) {
              return "[\n" + nextIndent + partial.join(",\n" + nextIndent) + "\n" + currentIndent + "]";
            }
            return partial.length === 0 ? "[]" : "[" + partial.join(",") + "]";
          }
          var keys = Object.keys(value);
          for (var k = 0; k < keys.length; k++) {
            var v = str(keys[k], value, replacer, space, nextIndent);
            if (v !== undefined && v !== null) {
              partial.push(quote(keys[k]) + (space ? ": " : ":") + v);
            }
          }
          if (space && partial.length > 0) {
            return "{\n" + nextIndent + partial.join(",\n" + nextIndent) + "\n" + currentIndent + "}";
          }
          return partial.length === 0 ? "{}" : "{" + partial.join(",") + "}";
        default:
          return undefined as any;
      }
    };

    (window as any).JSON = {
      stringify: function (value: any, replacer?: any, space?: any): string {
        cx.lastIndex = 0;
        if (cx.test(String(value))) {
          value = String(value).replace(cx, function (a: string): string {
            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
          });
        }
        var rep: Function | undefined;
        if (typeof replacer === "function") {
          rep = replacer;
        } else if (replacer && typeof replacer === "object" && typeof replacer.length === "number") {
          rep = function (key: string, val: any): any {
            // Root key "" should always pass through
            if (key === "") {
              return val;
            }
            for (var i = 0; i < (replacer as any).length; i++) {
              if ((replacer as any)[i] === key) {
                return val;
              }
            }
            return undefined;
          };
        }
        return str("", { "": value }, rep, typeof space === "string" || typeof space === "number" ? String(space) : undefined);
      },
      parse: function (text: string, reviver?: Function): any {
        var j: any;
        var walk = function (holder: any, key: string): any {
          var val = holder[key];
          if (val && typeof val === "object") {
            var keys = Object.keys(val);
            for (var i = 0; i < keys.length; i++) {
              var k = keys[i];
              var v = walk(val, k);
              if (v !== undefined) {
                val[k] = v;
              } else {
                delete val[k];
              }
            }
          }
          return reviver.call(holder, key, val);
        };
        text = String(text);
        cx.lastIndex = 0;
        if (cx.test(text)) {
          text = text.replace(cx, function (a: string): string {
            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
          });
        }
        // Validate JSON before eval
        if (/^[\],:{}\s]*$/.test(
          text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
            .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
            .replace(/(?:^|:|,)(?:\s*\[)+/g, "")
        )) {
          j = eval("(" + text + ")");
          return typeof reviver === "function" ? walk({ "": j }, "") : j;
        }
        throw new SyntaxError("JSON.parse");
      }
    };
  }
}
