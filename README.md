# ie6_helper

[![CI](https://github.com/AnQiOfDishanqian/ie6_helper/actions/workflows/ci.yml/badge.svg)](https://github.com/AnQiOfDishanqian/ie6_helper/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/ie6_helper.svg)](https://www.npmjs.com/package/ie6_helper)

Polyfills to help IE6 use advanced features of the newest ES version.

**[Live Demo](https://anqiofdishanqian.github.io/ie6_helper/)**

## Features

### ES5 Polyfills
- **Array**: `isArray`, `indexOf`, `lastIndexOf`, `forEach`, `map`, `filter`, `every`, `some`, `reduce`, `reduceRight`
- **Object**: `keys`, `create`, `getPrototypeOf`, `defineProperty`, `defineProperties`, `getOwnPropertyDescriptor`, `freeze`, `seal`, `preventExtensions`, `isFrozen`, `isSealed`, `isExtensible`
- **Function**: `bind`
- **String**: `trim`
- **Date**: `now`, `toISOString`, `toJSON`
- **JSON**: `stringify` (with replacer & space), `parse` (with reviver)

### ES6 Polyfills
- **Array**: `find`, `findIndex`, `fill`, `Array.of`, `Array.from`
- **Object**: `is`, `assign`
- **String**: `startsWith`, `endsWith`, `includes`, `repeat`, `String.raw`
- **Promise**: `then`, `catch`, `finally`, `Promise.resolve`, `Promise.reject`, `Promise.all`, `Promise.race`, `Promise.allSettled`, `Promise.any`
- **Map**: `get`, `set`, `has`, `delete`, `clear`, `size`, `forEach`, `keys`, `values`, `entries`
- **Set**: `add`, `has`, `delete`, `clear`, `size`, `forEach`, `keys`, `values`, `entries`
- **requestAnimationFrame** / **cancelAnimationFrame**

### ES2017 Polyfills
- **Object**: `values`, `entries`
- **String**: `padStart`, `padEnd`

### Utility Helpers
- `createDeferred()` — Promise-like deferred object

### DOM Helpers
- `onDOMContentLoaded(callback)` — DOMContentLoaded with IE6 doScroll fallback
- `querySelector(selector)` / `querySelectorAll(selector)` — basic selectors (#id, tag, .class)
- `polyfillEventListener()` — addEventListener via attachEvent
- `polyfillClassList()` — classList with contains/add/remove/toggle
- `polyfillConsole()` — no-op console stub

## Installation

Download the [latest release](https://github.com/AnQiOfDishanqian/ie6_helper/releases) or build from source:

```bash
git clone https://github.com/AnQiOfDishanqian/ie6_helper.git
cd ie6_helper
npm install
npm run build
```

## Usage

Include the script before any other scripts in your page:

```html
<!-- Production (minified, 18K) -->
<script src="ie6_helper.min.js"></script>

<!-- Development (50K) -->
<script src="ie6_helper.js"></script>
```

All polyfills are applied automatically. You can then use modern JS features:

```html
<script src="ie6_helper.min.js"></script>
<script>
  // Array methods
  [1, 2, 3].forEach(function(n) { alert(n); });
  var doubled = [1, 2, 3].map(function(n) { return n * 2; });
  var even = [1, 2, 3, 4].filter(function(n) { return n % 2 === 0; });

  // Object methods
  var obj = Object.assign({}, { a: 1 }, { b: 2 });
  var keys = Object.keys(obj);
  var vals = Object.values(obj);

  // String methods
  "  hello  ".trim();            // "hello"
  "hello world".startsWith("hello"); // true
  "hello world".includes("world");   // true
  "abc".repeat(3);               // "abcabcabc"
  "5".padStart(3, "0");          // "005"

  // JSON
  var data = JSON.parse('{"key":"value"}');
  var str = JSON.stringify(data, null, 2);

  // Function.bind
  var fn = greet.bind({ name: "IE6" });
  function greet() { return "Hello from " + this.name; }

  // Promise (global polyfill)
  var p = new Promise(function(resolve) { resolve(42); });
  p.then(function(v) { alert(v); });           // 42

  Promise.all([p, Promise.resolve(1)])
    .then(function(results) { alert(results); }); // [42, 1]

  // Map (global polyfill)
  var map = new Map();
  map.set("key", "value");
  map.get("key"); // "value"
  map.has("key"); // true
  map.size;       // 1

  // Set (global polyfill)
  var set = new Set();
  set.add(1).add(2).add(3);
  set.has(2);    // true
  set.size;      // 3
  set.delete(1); // true

  // Utility helpers via the ie6_helper namespace
  var deferred = ie6_helper.util.createDeferred();
  deferred.promise.then(function(value) { alert(value); });
  deferred.resolve("done");

  // DOM helpers
  ie6_helper.dom.onDOMContentLoaded(function() {
    var el = ie6_helper.dom.querySelector("#app");
    var items = ie6_helper.dom.querySelectorAll(".item");
  });
</script>
```

### Selective Polyfill Application

If you only need specific polyfills, you can call them individually:

```html
<script src="ie6_helper.min.js"></script>
<script>
  // Only apply Array and String polyfills
  ie6_helper.polyfill.array();
  ie6_helper.polyfill.string();
</script>
```

## Build

```bash
npm run build    # Compile TypeScript + minify
npm run test     # Run unit tests (236 tests)
npm run clean    # Remove dist/
```

## Browser Compatibility

Designed for **Internet Explorer 6** and similarly ancient browsers. All code:

- Targets ES5 (no arrow functions, let/const, etc.)
- Uses `var` instead of `let`/`const`
- Avoids `use strict` to prevent IE6 errors
- Uses `attachEvent` fallbacks for event handling
- Provides best-effort no-ops for unenforceable features (`Object.freeze`, `Object.seal`, etc.)

## Limitations

- **Object.defineProperty**: Getters/setters are silently ignored (IE6 doesn't support them). Only value descriptors work.
- **Object.freeze / seal / preventExtensions**: Return the object unchanged (no-op). `isFrozen`/`isSealed` return `false`, `isExtensible` returns `true`.
- **querySelector/querySelectorAll**: Only supports simple selectors: `#id`, `tag`, `.class`.
- **Array.from**: Does not support iterable/iterator protocol.
- **Promise**: Synchronous resolution (no microtask queue) — callbacks execute immediately when the promise is already settled. This differs from native Promises which always schedule callbacks asynchronously.
- **Map / Set**: `keys()`, `values()`, `entries()` return arrays instead of iterators. Does not support `Symbol.iterator` or `for...of`.
- **classList**: Uses `__defineGetter__` which may not be available in all IE6 configurations.

## License

MIT
