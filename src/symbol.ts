/**
 * Symbol polyfill for IE6
 * Provides a basic Symbol implementation with unique IDs.
 * Since IE6 doesn't support Symbol as a primitive or property key,
 * this polyfill creates unique string-based symbols.
 */

var symbolCounter = 0;
var symbolRegistry: { [key: string]: { key: string; symbol: string } } = {};
var symbolDescMap: { [symbol: string]: string } = {};

// Well-known symbols
var wellKnownSymbols: { [name: string]: string } = {};

function getWellKnown(name: string): string {
  if (!wellKnownSymbols[name]) {
    wellKnownSymbols[name] = "__ie6_symbol_Symbol." + name + "__";
    symbolDescMap[wellKnownSymbols[name]] = "Symbol(" + name + ")";
  }
  return wellKnownSymbols[name];
}

/**
 * IE6Symbol - creates a unique symbol string.
 * Not a true primitive, but a unique string that won't collide.
 */
function IE6Symbol(description?: string | number): string {
  if (this instanceof IE6Symbol) {
    throw new TypeError("Symbol is not a constructor");
  }
  var id = "__ie6_symbol_" + (++symbolCounter) + "__";
  symbolDescMap[id] = "Symbol(" + (description !== undefined ? String(description) : "") + ")";
  return id;
}

// Static methods

IE6Symbol.for = function (key: string): string {
  var stringKey = String(key);
  if (symbolRegistry[stringKey]) {
    return symbolRegistry[stringKey].symbol;
  }
  var sym = "__ie6_symbol_for_" + stringKey + "__";
  symbolRegistry[stringKey] = { key: stringKey, symbol: sym };
  symbolDescMap[sym] = "Symbol(" + stringKey + ")";
  return sym;
};

IE6Symbol.keyFor = function (sym: string): string | undefined {
  for (var k in symbolRegistry) {
    if (symbolRegistry[k].symbol === sym) {
      return symbolRegistry[k].key;
    }
  }
  return undefined;
};

// Well-known symbol properties
IE6Symbol.iterator = getWellKnown("iterator");
IE6Symbol.toStringTag = getWellKnown("toStringTag");
IE6Symbol.hasInstance = getWellKnown("hasInstance");
IE6Symbol.isConcatSpreadable = getWellKnown("isConcatSpreadable");
IE6Symbol.match = getWellKnown("match");
IE6Symbol.matchAll = getWellKnown("matchAll");
IE6Symbol.replace = getWellKnown("replace");
IE6Symbol.search = getWellKnown("search");
IE6Symbol.split = getWellKnown("split");
IE6Symbol.species = getWellKnown("species");
IE6Symbol.toPrimitive = getWellKnown("toPrimitive");
IE6Symbol.unscopables = getWellKnown("unscopables");
IE6Symbol.asyncIterator = getWellKnown("asyncIterator");

// Prototype methods
(IE6Symbol as any).prototype = {
  toString: function (): string {
    var desc = symbolDescMap[this as string];
    return desc !== undefined ? desc : "Symbol()";
  },
  valueOf: function (): string {
    return this as string;
  }
};

// Make typeof return "symbol" for our polyfill symbols
// (This is a best-effort — can't truly override typeof in IE6)
IE6Symbol._isSymbol = function (val: any): boolean {
  return typeof val === "string" && val.indexOf("__ie6_symbol_") === 0;
};

/**
 * Installs the Symbol polyfill if not natively available.
 */
export function polyfillSymbol(): void {
  if (typeof (window as any).Symbol === "undefined") {
    (window as any).Symbol = IE6Symbol;
  }
}

export { IE6Symbol };
