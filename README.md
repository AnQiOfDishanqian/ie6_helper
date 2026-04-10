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
- **requestAnimationFrame** / **cancelAnimationFrame**

### ES2017 Polyfills
- **Object**: `values`, `entries`
- **String**: `padStart`, `padEnd`

### Utility Helpers
- `createDeferred()` — Promise-like deferred object
- `createMap()` — Map-like key-value store
- `createSet()` — Set-like value collection

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

  // Utility helpers via the ie6_helper namespace
  var deferred = ie6_helper.util.createDeferred();
  deferred.promise.then(function(value) { alert(value); });
  deferred.resolve("done");

  var map = ie6_helper.util.createMap();
  map.set("key", "value");
  map.get("key"); // "value"

  var set = ie6_helper.util.createSet();
  set.add(1);
  set.has(1); // true

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
npm run test     # Run unit tests (162 tests)
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
- **createDeferred**: Not a full Promise implementation — no chaining, no `catch`, no `Promise.all`.
- **classList**: Uses `__defineGetter__` which may not be available in all IE6 configurations.

## License

MIT
