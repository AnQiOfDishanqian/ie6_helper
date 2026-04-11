/**
 * ie6_helper - Polyfills to help IE6 use advanced ES features
 *
 * Usage:
 *   Include this script in your page before any other scripts:
 *   <script src="ie6_helper.js"></script>
 *
 *   All polyfills are applied automatically.
 *   Utility functions are available via the ie6_helper namespace.
 */

// Polyfill modules
import { polyfillArray } from "./array";
import { polyfillObject } from "./object";
import { polyfillString } from "./string";
import { polyfillFunction } from "./function";
import { polyfillJSON } from "./json";
import { polyfillDate } from "./date";
import { polyfillConsole } from "./console";
import { polyfillPromise } from "./promise";
import { polyfillMap } from "./map";
import { polyfillSet } from "./set";
import { polyfillSymbol } from "./symbol";
import { polyfillWeakMap } from "./weakmap";
import { polyfillRequestAnimationFrame, createDeferred } from "./utils";
import { onDOMContentLoaded, querySelector, querySelectorAll, polyfillEventListener, polyfillClassList } from "./dom";

// Apply all prototype / global polyfills
function applyAll(): void {
  polyfillConsole();
  polyfillJSON();
  polyfillArray();
  polyfillObject();
  polyfillString();
  polyfillFunction();
  polyfillDate();
  polyfillPromise();
  polyfillMap();
  polyfillSet();
  polyfillSymbol();
  polyfillWeakMap();
  polyfillRequestAnimationFrame();
  polyfillEventListener();
  polyfillClassList();
}

// Export utility namespace
var ie6_helper = {
  // Apply all built-in polyfills at once
  applyAll: applyAll,

  // Individual polyfill functions (in case you want selective application)
  polyfill: {
    array: polyfillArray,
    object: polyfillObject,
    string: polyfillString,
    fn: polyfillFunction,
    json: polyfillJSON,
    date: polyfillDate,
    console: polyfillConsole,
    promise: polyfillPromise,
    map: polyfillMap,
    set: polyfillSet,
    symbol: polyfillSymbol,
    weakMap: polyfillWeakMap,
    requestAnimationFrame: polyfillRequestAnimationFrame,
    eventListener: polyfillEventListener,
    classList: polyfillClassList
  },

  // Standalone utility functions (not prototype extensions)
  util: {
    createDeferred: createDeferred
  },

  // DOM helpers
  dom: {
    onDOMContentLoaded: onDOMContentLoaded,
    querySelector: querySelector,
    querySelectorAll: querySelectorAll
  }
};

// Auto-apply all polyfills when the script loads
applyAll();

// Expose to global scope
(window as any).ie6_helper = ie6_helper;
