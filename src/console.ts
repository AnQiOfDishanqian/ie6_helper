/**
 * Console polyfill for IE6
 * IE6 does not have a native console object
 */

export function polyfillConsole(): void {
  if (typeof console === "undefined") {
    (window as any).console = {
      log: function () {},
      warn: function () {},
      error: function () {},
      info: function () {},
      debug: function () {},
      dir: function () {},
      trace: function () {},
      assert: function () {},
      count: function () {},
      time: function () {},
      timeEnd: function () {},
      group: function () {},
      groupEnd: function () {}
    };
  }
}
