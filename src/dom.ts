/**
 * IE6 DOM helper utilities
 * Modern DOM APIs that IE6 lacks
 */

/**
 * Add a DOMContentLoaded event handler for IE6
 * IE6 doesn't support DOMContentLoaded natively
 */
export function onDOMContentLoaded(callback: Function): void {
  if (document.readyState === "complete" || document.readyState === "interactive") {
    callback();
    return;
  }

  // Try document.addEventListener first (won't exist in IE6)
  if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", function () {
      callback();
    });
    return;
  }

  // IE6 fallback: use readystatechange + doScroll trick
  var done = false;
  var doc: any = document;

  function init(): void {
    if (!done) {
      done = true;
      callback();
    }
  }

  // readystatechange on document
  doc.attachEvent("onreadystatechange", function () {
    if (document.readyState === "complete") {
      doc.detachEvent("onreadystatechange", arguments.callee);
      init();
    }
  });

  // doScroll trick - only works when DOM is ready
  try {
    doc.documentElement.doScroll("left");
  } catch (_e) {
    // DOM not ready yet, retry
    setTimeout(function () {
      try {
        doc.documentElement.doScroll("left");
        init();
      } catch (_e2) {
        setTimeout(arguments.callee, 50);
      }
    }, 50);
    return;
  }
  init();

  // Also listen for window load as last resort
  (window as any).attachEvent("onload", init);
}

/**
 * querySelector polyfill for IE6
 * Very basic - supports simple tag, id, and class selectors only
 */
export function querySelector(selector: string, context?: any): any {
  var root = context || document;

  // ID selector: #foo
  if (/^#[\w-]+$/.test(selector)) {
    return document.getElementById(selector.substring(1));
  }

  // Tag selector: div
  if (/^\w+$/.test(selector)) {
    return root.getElementsByTagName(selector)[0] || null;
  }

  // Class selector: .foo (IE6 doesn't support getElementsByClassName)
  if (/^\.[\w-]+$/.test(selector)) {
    var className = selector.substring(1);
    var all = root.getElementsByTagName("*");
    for (var i = 0; i < all.length; i++) {
      if ((" " + all[i].className + " ").indexOf(" " + className + " ") > -1) {
        return all[i];
      }
    }
    return null;
  }

  return null;
}

/**
 * querySelectorAll polyfill for IE6
 * Very basic - supports simple tag and class selectors only
 */
export function querySelectorAll(selector: string, context?: any): any[] {
  var root = context || document;

  // Tag selector: div
  if (/^\w+$/.test(selector)) {
    return Array.prototype.slice.call(root.getElementsByTagName(selector));
  }

  // Class selector: .foo
  if (/^\.[\w-]+$/.test(selector)) {
    var className = selector.substring(1);
    var all = root.getElementsByTagName("*");
    var result: any[] = [];
    for (var i = 0; i < all.length; i++) {
      if ((" " + all[i].className + " ").indexOf(" " + className + " ") > -1) {
        result.push(all[i]);
      }
    }
    return result;
  }

  // ID selector: #foo (returns array with single element)
  if (/^#[\w-]+$/.test(selector)) {
    var el = document.getElementById(selector.substring(1));
    return el ? [el] : [];
  }

  return [];
}

/**
 * addEventListener polyfill for IE6 using attachEvent
 */
export function polyfillEventListener(): void {
  var win: any = window;
  if (typeof win.addEventListener === "undefined" && typeof win.attachEvent !== "undefined") {
    (Window as any).prototype.addEventListener = function (type: string, listener: Function, _useCapture?: boolean): void {
      win.attachEvent("on" + type, function () {
        listener.call(this, window.event);
      });
    };
    (Window as any).prototype.removeEventListener = function (type: string, listener: Function, _useCapture?: boolean): void {
      win.detachEvent("on" + type, listener);
    };
  }
}

/**
 * classList polyfill for IE6
 */
export function polyfillClassList(): void {
  var testEl = document.createElement("div");
  if (typeof testEl.classList === "undefined") {
    var DOMTokenList = function (el: any) {
      this.element = el;
      this.className = el.className;
    };

    DOMTokenList.prototype.contains = function (token: string): boolean {
      return (" " + this.element.className + " ").indexOf(" " + token + " ") > -1;
    };

    DOMTokenList.prototype.add = function (token: string): void {
      if (!this.contains(token)) {
        this.element.className = this.element.className ? this.element.className + " " + token : token;
      }
    };

    DOMTokenList.prototype.remove = function (token: string): void {
      this.element.className = (" " + this.element.className + " ").replace(" " + token + " ", " ").replace(/^\s+|\s+$/g, "");
    };

    DOMTokenList.prototype.toggle = function (token: string): boolean {
      if (this.contains(token)) {
        this.remove(token);
        return false;
      } else {
        this.add(token);
        return true;
      }
    };

    // Define classList as an expando property using __defineGetter__ if available
    if ((Object as any).__defineGetter__) {
      (HTMLElement as any).prototype.__defineGetter__("classList", function () {
        return new DOMTokenList(this);
      });
    }
  }
}
